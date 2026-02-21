import { Router } from 'express';
import authRoutes from './auth.routes';
import publicRoutes from './public.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);

// Root API endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio API v1',
    endpoints: {
      auth: '/auth',
      public: '/public',
      admin: '/admin',
    },
  });
});

export default router;
