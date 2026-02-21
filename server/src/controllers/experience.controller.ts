import { Response } from 'express';
import { z } from 'zod';
import { eq, asc } from 'drizzle-orm';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { db } from '../db';
import { experiences } from '../db/schema';
import { redisService } from '../utils/redis';
import { Request } from 'express';

const CACHE_KEY = 'experience:all';
const CACHE_TTL = 3600;

const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)).optional(),
  current: z.boolean().default(false),
  description: z.string(),
  technologies: z.array(z.string()),
  order: z.number().default(0),
});

class ExperienceController {
  // Get all experience (public, cached)
  getAllExperience = asyncHandler(async (_: Request, res: Response) => {
    const cached = await redisService.get(CACHE_KEY);
    if (cached) {
      return res.json(new ApiResponse(200, JSON.parse(cached), 'Experience fetched successfully from cache'));
    }

    const result = await db.query.experiences.findMany({
      orderBy: [asc(experiences.order)],
    });

    await redisService.set(CACHE_KEY, JSON.stringify(result), CACHE_TTL);

    return res.json(new ApiResponse(200, result, 'Experiences fetched successfully'));
  });

  // Create experience (admin)
  createExperience = asyncHandler(async (req: Request, res: Response) => {
    const validation = experienceSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const [result] = await db.insert(experiences).values(validation.data).returning();

    await redisService.del(CACHE_KEY);

    res.status(201).json(new ApiResponse(201, result, 'Experience created successfully'));
  });

  // Update experience (admin)
  updateExperience = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = experienceSchema.partial().safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const [result] = await db
      .update(experiences)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(experiences.id, id as string))
      .returning();

    if (!result) {
      throw new ApiError(404, 'Experience not found');
    }

    await redisService.del(CACHE_KEY);

    res.json(new ApiResponse(200, result, 'Experience updated successfully'));
  });

  // Delete experience (admin)
  deleteExperience = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [result] = await db
      .delete(experiences)
      .where(eq(experiences.id, id as string))
      .returning();

    if (!result) {
      throw new ApiError(404, 'Experience not found');
    }

    await redisService.del(CACHE_KEY);

    res.json(new ApiResponse(200, result, 'Experience deleted successfully'));
  });
}

export const experienceController = new ExperienceController();
