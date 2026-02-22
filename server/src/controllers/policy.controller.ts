import { Response } from 'express';
import { z } from 'zod';
import { eq, asc } from 'drizzle-orm';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { db } from '../db';
import { policyPages } from '../db/schema';
import { Request } from 'express';

const updatePolicySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

class PolicyController {
  // Get policy page by slug (public)
  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const result = await db.query.policyPages.findFirst({
      where: eq(policyPages.slug, slug as string),
    });

    if (!result) {
      throw new ApiError(404, 'Policy page not found');
    }

    res.json(new ApiResponse(200, result, 'Policy page fetched successfully'));
  });

  // Get all policy pages (admin)
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await db.query.policyPages.findMany({
      orderBy: [asc(policyPages.slug)],
    });

    res.json(new ApiResponse(200, result, 'Policy pages fetched successfully'));
  });

  // Update policy page by slug (admin)
  updateBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const validation = updatePolicySchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const existing = await db.query.policyPages.findFirst({
      where: eq(policyPages.slug, slug as string),
    });

    if (!existing) {
      throw new ApiError(404, 'Policy page not found');
    }

    const [result] = await db
      .update(policyPages)
      .set({
        title: validation.data.title,
        content: validation.data.content,
        updatedAt: new Date(),
      })
      .where(eq(policyPages.slug, slug as string))
      .returning();

    res.json(new ApiResponse(200, result, 'Policy page updated successfully'));
  });
}

export const policyController = new PolicyController();
