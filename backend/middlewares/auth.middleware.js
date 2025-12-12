import { verifyAccessToken } from '../utils/jwt.util.js';
import User from '../models/User.model.js';
import { errorResponse } from '../utils/response.util.js';
import { STATUS_CODES, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(
                res,
                STATUS_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.UNAUTHORIZED
            );
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        if (!token) {
            return errorResponse(
                res,
                STATUS_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.INVALID_TOKEN
            );
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        // Find user
        const user = await User.findById(decoded.id).select('-password');

        if (!user || !user.isActive) {
            return errorResponse(
                res,
                STATUS_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.USER_NOT_FOUND
            );
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.message.includes('expired')) {
            return errorResponse(
                res,
                STATUS_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.TOKEN_EXPIRED
            );
        }
        return errorResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            ERROR_MESSAGES.INVALID_TOKEN
        );
    }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return errorResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            ERROR_MESSAGES.UNAUTHORIZED
        );
    }

    if (req.user.role !== 'admin') {
        return errorResponse(
            res,
            STATUS_CODES.FORBIDDEN,
            'Admin access required'
        );
    }

    next();
};

/**
 * Optional authentication - continues even if no token provided
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // Continue without user
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return next(); // Continue without user
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        // Find user
        const user = await User.findById(decoded.id).select('-password');

        if (user && user.isActive) {
            req.user = user; // Attach user if found
        }

        next();
    } catch (error) {
        // Continue without user even if token is invalid
        next();
    }
};

export default {
    authenticate,
    isAdmin,
    optionalAuth,
};
