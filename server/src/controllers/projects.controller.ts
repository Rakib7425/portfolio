import { Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
// import { prisma } from '../utils/prisma';
import { db } from '../db';
import { projects, projectViews } from '../db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { redisService } from '../utils/redis';
import { Request } from 'express';

const CACHE_KEY_ALL = 'projects:all';
const CACHE_KEY_PREFIX = 'project:';
const CACHE_TTL = 3600;

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  longDesc: z.string().optional(),
  imageUrl: z.string().url(),
  technologies: z.array(z.string()),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

class ProjectsController {
  // Get all projects (public, cached)
  getAllProjects = asyncHandler(async (_req: Request, res: Response) => {
    const cached = await redisService.get(CACHE_KEY_ALL);
    if (cached) {
      res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true,
      });
      return;
    }

    const projectsList = await db.select().from(projects).orderBy(asc(projects.order));

    await redisService.set(CACHE_KEY_ALL, JSON.stringify(projectsList), CACHE_TTL);

    return res.json(new ApiResponse(200, projectsList, 'Projects fetched successfully'));
  });

  // Get single project (public, cached)
  getProject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const cacheKey = `${CACHE_KEY_PREFIX}${id}`;

    const cached = await redisService.get(cacheKey);
    if (cached) {
      res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true,
      });
      return;
    }

    const projectList = await db.select().from(projects).where(eq(projects.id, id as string)).limit(1);
    const project = projectList[0];

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    // Include views - manual query since no relation loading
    const views = await db.select({
      id: projectViews.id,
      createdAt: projectViews.createdAt
    }).from(projectViews)
      .where(eq(projectViews.projectId, id as string))
      .orderBy(desc(projectViews.createdAt))
      .limit(10);

    const projectWithViews = { ...project, views };

    await redisService.set(cacheKey, JSON.stringify(projectWithViews), CACHE_TTL);

    res.json(new ApiResponse(200, projectWithViews, 'Project fetched successfully'));
  });

  // Create project (admin)
  createProject = asyncHandler(async (req: Request, res: Response) => {
    const validation = projectSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const newProjects = await db.insert(projects).values(validation.data).returning();
    const project = newProjects[0];

    await redisService.del(CACHE_KEY_ALL);

    res.status(201).json(new ApiResponse(201, project, 'Project created successfully'));
  });

  // Update project (admin)
  updateProject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = projectSchema.partial().safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const updatedProjects = await db.update(projects)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(projects.id, id as string))
      .returning();

    const project = updatedProjects[0];

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    await redisService.del(CACHE_KEY_ALL);
    await redisService.del(`${CACHE_KEY_PREFIX}${id}`);

    res.json(new ApiResponse(200, project, 'Project updated successfully'));
  });

  // Delete project (admin)
  deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedProjects = await db.delete(projects).where(eq(projects.id, id as string)).returning();

    if (deletedProjects.length === 0) {
      throw new ApiError(404, 'Project not found');
    }

    await redisService.del(CACHE_KEY_ALL);
    await redisService.del(`${CACHE_KEY_PREFIX}${id}`);

    res.json(new ApiResponse(200, deletedProjects[0], 'Project deleted successfully'));
  });
}

export const projectsController = new ProjectsController();
