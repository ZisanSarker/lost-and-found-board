/**
 * Application Constants
 * Centralized location for all application-wide constants
 * All constants are frozen to prevent modifications
 */

// ============================================
// HTTP Status Codes
// ============================================
export const STATUS_CODES = Object.freeze({
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
});

// ============================================
// Error Messages
// ============================================
export const ERROR_MESSAGES = Object.freeze({
    // Authentication
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token provided',
    EMAIL_ALREADY_EXISTS: 'Email already in use',

    // User
    USER_NOT_FOUND: 'User not found',
    USER_UPDATE_FAILED: 'Failed to update user',
    USER_DELETE_FAILED: 'Failed to delete user',

    // Item
    ITEM_NOT_FOUND: 'Item not found',
    ITEM_CREATE_FAILED: 'Failed to create item',
    ITEM_UPDATE_FAILED: 'Failed to update item',
    ITEM_DELETE_FAILED: 'Failed to delete item',
    UNAUTHORIZED_ITEM_ACCESS: 'You are not authorized to access this item',

    // Validation
    VALIDATION_ERROR: 'Validation error',
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PASSWORD: 'Password must be at least 8 characters long',

    // General
    SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
});

// ============================================
// Success Messages
// ============================================
export const SUCCESS_MESSAGES = Object.freeze({
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    ITEM_CREATED: 'Item created successfully',
    ITEM_UPDATED: 'Item updated successfully',
    ITEM_DELETED: 'Item deleted successfully',
});

// ============================================
// Validation Rules
// ============================================
export const VALIDATION_RULES = Object.freeze({
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    DESCRIPTION_MAX_LENGTH: 2000,
    TITLE_MAX_LENGTH: 200,
});

// ============================================
// Item Configuration
// ============================================
export const ITEM_TYPES = Object.freeze({
    LOST: 'lost',
    FOUND: 'found',
});

export const ITEM_STATUS = Object.freeze({
    ACTIVE: 'active',
    CLAIMED: 'claimed',
    CLOSED: 'closed',
    RESOLVED: 'resolved',
});

// ============================================
// JWT Configuration
// ============================================
export const JWT_CONFIG = Object.freeze({
    ACCESS_TOKEN_EXPIRY: '24h',
    REFRESH_TOKEN_EXPIRY: '7d',
    COOKIE_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});

// ============================================
// Pagination Configuration
// ============================================
export const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
});

// ============================================
// File Upload Configuration
// ============================================
export const FILE_UPLOAD = Object.freeze({
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: Object.freeze(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']),
});

export default {
    STATUS_CODES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    VALIDATION_RULES,
    ITEM_TYPES,
    ITEM_STATUS,
    JWT_CONFIG,
    PAGINATION,
    FILE_UPLOAD,
};
