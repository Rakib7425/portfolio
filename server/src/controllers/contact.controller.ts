import { Response } from 'express';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { db } from '../db';
import { contacts } from '../db/schema';
import { Request } from 'express';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

class ContactController {
  // Submit contact form (public)
  submitContact = asyncHandler(async (req: Request, res: Response) => {
    const validation = contactSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const [contact] = await db.insert(contacts).values(validation.data).returning();

    res.status(201).json(new ApiResponse(201, contact, 'Message sent successfully. We\'ll get back to you soon!'));
  });

  // Get all contacts (admin)
  getAllContacts = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '20', unreadOnly = 'false' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const whereCondition = unreadOnly === 'true' ? eq(contacts.read, false) : undefined;

    const [contactsList, totalResult] = await Promise.all([
      db.select()
        .from(contacts)
        .where(whereCondition)
        .orderBy(desc(contacts.createdAt))
        .limit(limitNum)
        .offset(offset),
      db.select({ count: count() })
        .from(contacts)
        .where(whereCondition),
    ]);

    const total = totalResult[0]?.count || 0;

    res.json(new ApiResponse(200, {
      contacts: contactsList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    }, 'Contacts fetched successfully'));
  });

  // Get single contact (admin)
  getContact = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const contactList = await db.select().from(contacts).where(eq(contacts.id, id as string)).limit(1);
    const contact = contactList[0];

    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }

    res.json(new ApiResponse(200, contact, 'Contact fetched successfully'));
  });

  // Mark contact as read (admin)
  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [contact] = await db
      .update(contacts)
      .set({ read: true, updatedAt: new Date() })
      .where(eq(contacts.id, id as string))
      .returning();

    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }

    res.json(new ApiResponse(200, contact, 'Contact marked as read'));
  });

  // Delete contact (admin)
  deleteContact = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [contact] = await db
      .delete(contacts)
      .where(eq(contacts.id, id as string))
      .returning();

    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }

    res.json(new ApiResponse(200, contact, 'Contact deleted successfully'));
  });
}

export const contactController = new ContactController();
