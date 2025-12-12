import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.util.js';
import { STATUS_CODES, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Validation Middleware
 * Handles express-validator validation results
 */

/**
 * Middleware to handle validation errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
        }, {});

        return errorResponse(
            res,
            STATUS_CODES.UNPROCESSABLE_ENTITY,
            ERROR_MESSAGES.VALIDATION_ERROR,
            formattedErrors
        );
    }

    next();
};

export default validate;
