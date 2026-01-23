import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import configurations
import { connectDB, disconnectDB } from './config/database.js';
import { corsOptions } from './config/security.js';

// Import routes
import apiRoutes from './routes/index.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Create Express app
const app = express();

// Connect to database
connectDB();

// ============================================
// Middleware Configuration
// ============================================
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // CORS configuration
app.use(morgan('dev')); // HTTP request logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// ============================================
// Routes
// ============================================

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Lost and Found Board API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            items: '/api/items',
            users: '/api/users',
        },
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Mount API routes
app.use('/api', apiRoutes);

// ============================================
// Error Handling Middleware (must be last)
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// Server Initialization
// ============================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`\n✓ Server running on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Client URL: ${process.env.CLIENT_URL || 'not set'}\n`);
});

// ============================================
// Error Handlers
// ============================================

// Handle unhandled promise rejections
process.on('unhandledRejection', async (err) => {
    await gracefulShutdown('Unhandled Rejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
    await gracefulShutdown('Uncaught Exception');
});

// Graceful shutdown on SIGTERM (e.g., Kubernetes, Docker)
process.on('SIGTERM', async () => {
    await gracefulShutdown('SIGTERM');
});

// Graceful shutdown on SIGINT (e.g., Ctrl+C)
process.on('SIGINT', async () => {
    await gracefulShutdown('SIGINT');
});

/**
 * Gracefully shutdown the server
 * @param {string} signal - The signal that triggered the shutdown
 */
async function gracefulShutdown(signal) {
    console.log(`\n⚠ ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        try {
            await disconnectDB();
            console.log('✓ Server closed');
            process.exit(0);
        } catch (error) {
            console.error('✗ Error during shutdown:', error.message);
            process.exit(1);
        }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        process.exit(1);
    }, 10000);
}

export default app;
