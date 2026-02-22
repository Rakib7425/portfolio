import { Router } from 'express';
import { profileController } from '../../controllers/profile.controller';
import { skillsController } from '../../controllers/skills.controller';
import { experienceController } from '../../controllers/experience.controller';
import { projectsController } from '../../controllers/projects.controller';
import { contactController } from '../../controllers/contact.controller';
import { analyticsController } from '../../controllers/analytics.controller';
import { policyController } from '../../controllers/policy.controller';
import { contactLimiter } from '../../middlewares/rateLimiter';
import { subscriberController } from '../../controllers/subscriber.controller';

const router = Router();

// Profile routes
router.get('/profile', profileController.getProfile);
router.get('/profile/resume', profileController.downloadResume);

// Skills routes
router.get('/skills', skillsController.getAllSkills);

// Experience routes
router.get('/experience', experienceController.getAllExperience);

// Projects routes
router.get('/projects', projectsController.getAllProjects);
router.get('/projects/:id', projectsController.getProject);

// Contact routes
router.post('/contact', contactLimiter, contactController.submitContact);

// Analytics routes
router.post('/analytics/view', analyticsController.trackPageView);
router.post('/analytics/project/:id', analyticsController.trackProjectView);

// Newsletter routes
router.post('/subscribe', subscriberController.subscribe);

// Policy pages (Privacy Policy, Terms of Service)
router.get('/policy/:slug', policyController.getBySlug);

export default router;
