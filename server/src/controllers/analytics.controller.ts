import { Response } from 'express';
import { z } from 'zod';
import { eq, desc, count, gte } from 'drizzle-orm';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { db } from '../db';
import { pageViews, projectViews, contacts, projects } from '../db/schema';
import { Request } from 'express';

const pageViewSchema = z.object({
  page: z.string().min(1),
  userAgent: z.string().optional(),
});

const projectViewSchema = z.object({
  userAgent: z.string().optional(),
});

class AnalyticsController {
  // Track page view (public)
  trackPageView = asyncHandler(async (req: Request, res: Response) => {
    const validation = pageViewSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const { page, userAgent } = validation.data;
    const ipAddress = (req.ip || req.socket.remoteAddress || null) as string | null;

    await db.insert(pageViews).values({
      page,
      userAgent: userAgent || (req.headers['user-agent'] as string) || null,
      ipAddress,
    });

    res.json(new ApiResponse(200, null, 'Page view tracked'));
  });

  // Track project view (public)
  trackProjectView = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = projectViewSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const { userAgent } = validation.data;
    const ipAddress = (req.ip || req.socket.remoteAddress || null) as string | null;

    await db.insert(projectViews).values({
      projectId: id as string,
      userAgent: userAgent || (req.headers['user-agent'] as string) || null,
      ipAddress,
    });

    res.json(new ApiResponse(200, null, 'Project view tracked'));
  });

  // Get analytics overview (admin)
  getOverview = asyncHandler(async (_req: Request, res: Response) => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalPageViewsResult,
      recentPageViewsResult,
      totalContactsResult,
      unreadContactsResult,
      topProjectsList,
    ] = await Promise.all([
      db.select({ count: count() }).from(pageViews),
      db.select({ count: count() }).from(pageViews).where(gte(pageViews.createdAt, last30Days)),
      db.select({ count: count() }).from(contacts),
      db.select({ count: count() }).from(contacts).where(eq(contacts.read, false)),
      db.select({
        projectId: projectViews.projectId,
        views: count(projectViews.id),
      })
        .from(projectViews)
        .groupBy(projectViews.projectId)
        .orderBy(desc(count(projectViews.id)))
        .limit(5),
    ]);

    const totalPageViews = totalPageViewsResult[0]?.count || 0;
    const recentPageViews = recentPageViewsResult[0]?.count || 0;
    const totalContacts = totalContactsResult[0]?.count || 0;
    const unreadContacts = unreadContactsResult[0]?.count || 0;

    // Get project details for top viewed projects
    const topProjects = await Promise.all(
      topProjectsList.map(async (pv) => {
        const projectList = await db.select({ id: projects.id, title: projects.title }).from(projects).where(eq(projects.id, pv.projectId)).limit(1);
        const project = projectList[0];
        return {
          project,
          views: pv.views,
        };
      })
    );

    res.json(new ApiResponse(200, {
      pageViews: {
        total: totalPageViews,
        last30Days: recentPageViews,
      },
      contacts: {
        total: totalContacts,
        unread: unreadContacts,
      },
      topProjects,
    }, 'Analytics overview fetched successfully'));
  });

  // Get page views by page (admin)
  getPageViews = asyncHandler(async (req: Request, res: Response) => {
    const { days = '30' } = req.query;

    const daysAgo = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);

    const result = await db
      .select({
        page: pageViews.page,
        views: count(pageViews.id),
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, daysAgo))
      .groupBy(pageViews.page)
      .orderBy(desc(count(pageViews.id)));

    res.json(new ApiResponse(200, result.map((pv) => ({
      page: pv.page,
      views: pv.views,
    })), 'Page views fetched successfully'));
  });

  // Get project views (admin)
  getProjectViews = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, days = '30' } = req.query;

    const daysAgo = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);

    let query = db
      .select({
        projectId: projectViews.projectId,
        views: count(projectViews.id),
      })
      .from(projectViews)
      .where(gte(projectViews.createdAt, daysAgo))
      .groupBy(projectViews.projectId)
      .orderBy(desc(count(projectViews.id)))
      .$dynamic();

    if (projectId) {
      query = query.where(eq(projectViews.projectId, projectId as string));
    }

    const projectViewsList = await query;

    const result = await Promise.all(
      projectViewsList.map(async (pv) => {
        const projectList = await db.select({ id: projects.id, title: projects.title, imageUrl: projects.imageUrl }).from(projects).where(eq(projects.id, pv.projectId)).limit(1);
        const project = projectList[0];
        return {
          project,
          views: pv.views,
        };
      })
    );

    res.json(new ApiResponse(200, result, 'Project views fetched successfully'));
  });
}

export const analyticsController = new AnalyticsController();
