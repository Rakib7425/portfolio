import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { authLimiter } from '../../middlewares/rateLimiter';

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

// @route   POST /api/v1/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', authController.refresh);

// @route   POST /api/v1/auth/logout
// @desc    Logout (invalidate refresh token)
// @access  Public
router.post('/logout', authController.logout);

export default router;
