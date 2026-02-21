import { Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { db } from '../db';
import { profiles } from '../db/schema';
import { eq } from 'drizzle-orm';
import { redisService } from '../utils/redis';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

const CACHE_KEY = 'profile';
const CACHE_TTL = 3600; // 1 hour

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  photoUrl: z.string().url().optional(),
  resumeUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
});

class ProfileController {
  // Get profile (public)
  getProfile = asyncHandler(async (_req: Request, res: Response) => {
    // Try cache first
    const cached = await redisService.get(CACHE_KEY);
    if (cached) {
      return res.json(new ApiResponse(200, JSON.parse(cached), 'Profile fetched successfully from cache'));
    }

    // Fetch from database
    const profileList = await db.select().from(profiles).limit(1);
    const profile = profileList[0];

    if (!profile) {
      throw new ApiError(404, 'Profile not found');
    }

    // Cache the result
    await redisService.set(CACHE_KEY, JSON.stringify(profile), CACHE_TTL);

    return res.json(new ApiResponse(200, profile, 'Profile fetched successfully'));
  });

  // Update profile (admin)
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const validation = updateProfileSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const data = validation.data;

    // Get existing profile
    const profileList = await db.select().from(profiles).limit(1);
    let profile;

    if (profileList.length === 0) {
      // Create if doesn't exist
      // @ts-ignore - types mismatch with zod optional vs required db fields, handling broadly for migration
      const newProfiles = await db.insert(profiles).values(data).returning();
      profile = newProfiles[0];
    } else {
      // Update existing
      const existingId = profileList[0].id;
      const updatedProfiles = await db.update(profiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profiles.id, existingId))
        .returning();
      profile = updatedProfiles[0];
    }

    // Invalidate cache
    await redisService.del(CACHE_KEY);

    res.json(new ApiResponse(200, profile, 'Profile updated successfully'));
  });

  // Upload Resume
  uploadResume = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    // path is relative from project root
    const resumePath = `/uploads/resumes/${req.file.filename}`;

    // Get existing profile
    const profileList = await db.select().from(profiles).limit(1);

    if (profileList.length > 0 && profileList[0].resumeUrl) {
      const oldFilePath = path.join(process.cwd(), profileList[0].resumeUrl);
      if (fs.existsSync(oldFilePath)) {
        const dir = path.dirname(oldFilePath);
        const ext = path.extname(oldFilePath);
        const base = path.basename(oldFilePath, ext);
        const archivedPath = path.join(dir, `archived-${Date.now()}-${base}${ext}`);
        fs.renameSync(oldFilePath, archivedPath);
      }
    }

    if (profileList.length === 0) {
      // Create new profile with resume
      await db.insert(profiles).values({
        name: 'Admin',
        title: 'Full Stack Developer',
        bio: 'Welcome',
        email: 'admin@example.com',
        resumeUrl: resumePath,
      }).returning();
    } else {
      // Update existing
      const existingId = profileList[0].id;
      await db.update(profiles)
        .set({ resumeUrl: resumePath, updatedAt: new Date() })
        .where(eq(profiles.id, existingId))
        .returning();
    }

    // Invalidate cache
    await redisService.del(CACHE_KEY);

    res.json(new ApiResponse(200, { resumeUrl: resumePath }, 'Resume uploaded successfully'));
  });

  // Download Resume
  downloadResume = asyncHandler(async (_: Request, res: Response) => {
    // Get profile
    const profileList = await db.select().from(profiles).limit(1);
    const profile = profileList[0];

    if (!profile || !profile.resumeUrl) {
      throw new ApiError(404, 'Resume not found');
    }

    const filePath = path.join(process.cwd(), profile.resumeUrl);

    if (!fs.existsSync(filePath)) {
      throw new ApiError(404, 'Resume file not found on server');
    }

    res.download(filePath, 'rakibul_resume.pdf');
  });
}

export const profileController = new ProfileController();
