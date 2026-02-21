import { Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { db } from '../db';
import { subscribers } from '../db/schema';
import { Request } from 'express';
import { sendWelcomeEmail } from '../utils/mailer';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

class SubscriberController {
  // Subscribe to newsletter
  subscribe = asyncHandler(async (req: Request, res: Response) => {
    const validation = subscribeSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const { email } = validation.data;

    try {
      await db.insert(subscribers).values({ email });

      // Send welcome email asynchronously so it doesn't block the response
      sendWelcomeEmail(email).catch(err => {
        console.error('Failed to send welcome email in background:', err);
      });
    } catch (error: any) {
      // Handle unique constraint violation (already subscribed)
      const isDuplicate =
        error.code === '23505' ||
        error.cause?.code === '23505' ||
        error.message?.includes('duplicate key') ||
        error.cause?.message?.includes('duplicate key') ||
        error.message?.includes('subscribers_email_unique') ||
        error.cause?.message?.includes('subscribers_email_unique');

      if (isDuplicate) {
        return res.status(400).json(new ApiError(400, 'You are already subscribed to the newsletter!'));
      }
      throw error;
    }

    return res.status(201).json(new ApiResponse(201, null, 'Successfully subscribed to the newsletter!'));
  });
}

export const subscriberController = new SubscriberController();
