import { STATUS_CODES } from '../config/constants.js';

/**
 * Response Utility Functions
 * Provides consistent response formatting across the application
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 */
export const successResponse = (res, statusCode = STATUS_CODES.OK, message = 'Success', data = null) => {
    const response = {
        success: true,
        message,
        timestamp: new Date().toISOString(),
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Validation errors or additional error details
 */
export const errorResponse = (res, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message = 'Error occurred', errors = null) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
    };

    if (errors !== null && errors !== undefined) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of data items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} message - Success message
 */
export const paginatedResponse = (res, data, page, limit, total, message = 'Data retrieved successfully') => {
    const totalPages = Math.ceil(total / limit);

    return res.status(STATUS_CODES.OK).json({
        success: true,
        message,
        timestamp: new Date().toISOString(),
        data,
        pagination: {
            currentPage: page,
            totalPages,
            itemsPerPage: limit,
            totalItems: total,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    });
};

export default {
    successResponse,
    errorResponse,
    paginatedResponse,
};
