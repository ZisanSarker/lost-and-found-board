import { errorResponse } from '../utils/response.util.js';
import { STATUS_CODES, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

/**
 * 404 Not Found Handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const notFoundHandler = (req, res, next) => {
    errorResponse(
        res,
        STATUS_CODES.NOT_FOUND,
        `Route ${req.originalUrl} not found`
    );
};

/**
 * Global Error Handler
 * Catches all errors and sends formatted response
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    const isDevelopment = process.env.NODE_ENV !== 'production';

    console.error('✗ Error:', err.message);
    if (isDevelopment) {
        console.error('  Stack:', err.stack);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).reduce((acc, error) => {
            acc[error.path] = error.message;
            return acc;
        }, {});

        return errorResponse(
            res,
            STATUS_CODES.UNPROCESSABLE_ENTITY,
            ERROR_MESSAGES.VALIDATION_ERROR,
            isDevelopment ? errors : undefined
        );
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);

        return errorResponse(
            res,
            STATUS_CODES.CONFLICT,
            `${capitalizedField} already exists`
        );
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return errorResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            `Invalid ${err.path}: ${err.value}`
        );
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        let message = 'File upload error';
        if (err.code === 'LIMIT_FILE_SIZE') message = 'File too large. Maximum size is 5MB.';
        if (err.code === 'LIMIT_FILE_COUNT') message = 'Too many files. Maximum is 5.';
        if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Unexpected file field.';

        return errorResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            message
        );
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            ERROR_MESSAGES.INVALID_TOKEN
        );
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            ERROR_MESSAGES.TOKEN_EXPIRED
        );
    }

    // Default error
    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

    // In production, don't expose internal error details
    const finalMessage = isDevelopment ? message : ERROR_MESSAGES.SERVER_ERROR;

    errorResponse(res, statusCode, finalMessage);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * Eliminates the need for try-catch in every async controller
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function that handles rejections
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default {
    notFoundHandler,
    errorHandler,
    asyncHandler,
};
