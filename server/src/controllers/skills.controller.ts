import { Response } from 'express';
import { z } from 'zod';
import { eq, asc } from 'drizzle-orm';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { db } from '../db';
import { skills } from '../db/schema';
import { redisService } from '../utils/redis';
import { Request } from 'express';

const CACHE_KEY = 'skills:all';
const CACHE_TTL = 3600;

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  proficiency: z.number().min(0).max(100).default(0),
  icon: z.string().optional(),
  order: z.number().default(0),
});

class SkillsController {
  // Get all skills (public, cached)
  getAllSkills = asyncHandler(async (_req: Request, res: Response) => {
    const cached = await redisService.get(CACHE_KEY);
    if (cached) {
      return res.json(new ApiResponse(200, JSON.parse(cached), 'Skills fetched successfully from cache'));
    }

    const result = await db.query.skills.findMany({
      orderBy: [asc(skills.order)],
    });

    await redisService.set(CACHE_KEY, JSON.stringify(result), CACHE_TTL);

    return res.json(new ApiResponse(200, result, 'Skills fetched successfully'));
  });

  // Create skill (admin)
  createSkill = asyncHandler(async (req: Request, res: Response) => {
    const validation = skillSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const [result] = await db.insert(skills).values(validation.data).returning();

    await redisService.del(CACHE_KEY);

    res.status(201).json(new ApiResponse(201, result, 'Skill created successfully'));
  });

  // Update skill (admin)
  updateSkill = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = skillSchema.partial().safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const [result] = await db
      .update(skills)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(skills.id, id as string))
      .returning();

    if (!result) {
      throw new ApiError(404, 'Skill not found');
    }

    await redisService.del(CACHE_KEY);

    res.json(new ApiResponse(200, result, 'Skill updated successfully'));
  });

  // Delete skill (admin)
  deleteSkill = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [result] = await db
      .delete(skills)
      .where(eq(skills.id, id as string))
      .returning();

    if (!result) {
      throw new ApiError(404, 'Skill not found');
    }

    await redisService.del(CACHE_KEY);

    res.json(new ApiResponse(200, result, 'Skill deleted successfully'));
  });
}

export const skillsController = new SkillsController();
