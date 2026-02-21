import { Response } from 'express';
import { z } from 'zod';
import { eq, asc } from 'drizzle-orm';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { db } from '../db';
import { seoMeta } from '../db/schema';
import { Request } from 'express';

const seoMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()),
  ogImage: z.string().url().optional(),
});

class SeoController {
  // Get all SEO metadata (admin)
  getAllSeoMeta = asyncHandler(async (_req: Request, res: Response) => {
    const result = await db.query.seoMeta.findMany({
      orderBy: [asc(seoMeta.page)],
    });

    res.json(new ApiResponse(200, result, 'SEO metadata fetched successfully'));
  });

  // Get SEO metadata for specific page (public)
  getSeoMeta = asyncHandler(async (req: Request, res: Response) => {
    const { page } = req.params;

    const result = await db.query.seoMeta.findFirst({
      where: eq(seoMeta.page, page as string),
    });

    if (!result) {
      throw new ApiError(404, 'SEO metadata not found for this page');
    }

    res.json(new ApiResponse(200, result, 'SEO metadata fetched successfully'));
  });

  // Update SEO metadata (admin)
  updateSeoMeta = asyncHandler(async (req: Request, res: Response) => {
    const { page } = req.params;
    const validation = seoMetaSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const [result] = await db
      .insert(seoMeta)
      .values({
        page: page as string,
        ...validation.data,
      })
      .onConflictDoUpdate({
        target: seoMeta.page,
        set: {
          ...validation.data,
          updatedAt: new Date(),
        },
      })
      .returning();

    res.json(new ApiResponse(200, result, 'SEO metadata updated successfully'));
  });
}

export const seoController = new SeoController();
