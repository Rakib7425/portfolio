import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { profileController } from '../../controllers/profile.controller';
import { skillsController } from '../../controllers/skills.controller';
import { experienceController } from '../../controllers/experience.controller';
import { projectsController } from '../../controllers/projects.controller';
import { contactController } from '../../controllers/contact.controller';
import { analyticsController } from '../../controllers/analytics.controller';
import { seoController } from '../../controllers/seo.controller';
import { apiLimiter } from '../../middlewares/rateLimiter';
import { upload } from '../../middlewares/upload';

const router = Router();

// Apply authentication to all admin routes
router.use(authenticate);
router.use(authorize('admin'));
router.use(apiLimiter);

// Profile management
router.put('/profile', profileController.updateProfile);
router.post('/profile/resume', upload.single('resume'), profileController.uploadResume);

// Skills management
router.post('/skills', skillsController.createSkill);
router.put('/skills/:id', skillsController.updateSkill);
router.delete('/skills/:id', skillsController.deleteSkill);

// Experience management
router.post('/experience', experienceController.createExperience);
router.put('/experience/:id', experienceController.updateExperience);
router.delete('/experience/:id', experienceController.deleteExperience);

// Projects management
router.post('/projects', projectsController.createProject);
router.put('/projects/:id', projectsController.updateProject);
router.delete('/projects/:id', projectsController.deleteProject);

// Contact messages
router.get('/contacts', contactController.getAllContacts);
router.get('/contacts/:id', contactController.getContact);
router.put('/contacts/:id/read', contactController.markAsRead);
router.delete('/contacts/:id', contactController.deleteContact);

// Analytics
router.get('/analytics/overview', analyticsController.getOverview);
router.get('/analytics/page-views', analyticsController.getPageViews);
router.get('/analytics/project-views', analyticsController.getProjectViews);

// SEO Management
router.get('/seo', seoController.getAllSeoMeta);
router.get('/seo/:page', seoController.getSeoMeta);
router.put('/seo/:page', seoController.updateSeoMeta);

export default router;
