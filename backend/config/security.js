import helmet from 'helmet';
import cors from 'cors';

/**
 * Security Configuration
 * Configures CORS, Helmet, Rate Limiting, and other security measures
 */

/**
 * CORS Configuration
 * Allows requests from specified frontend URL
 */
export const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

/**
 * Helmet Configuration
 * Secures HTTP headers
 */
export const helmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
};

/**
 * Session Configuration
 */
export const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict',
    },
};

export default {
    corsOptions,
    helmetOptions,
    sessionOptions,
};
