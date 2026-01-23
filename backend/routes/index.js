import express from 'express';
import authRoutes from './auth.routes.js';
import itemRoutes from './item.routes.js';
import userRoutes from './user.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

/**
 * Main API Router
 * Mounts all route modules with their respective base paths
 */

// API Health Check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);

export default router;
