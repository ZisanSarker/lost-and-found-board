import validator from 'validator';
import { VALIDATION_RULES } from '../config/constants.js';

/**
 * Validation Utility Functions
 * Provides reusable validation functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }

    if (!validator.isEmail(email)) {
        return { isValid: false, message: 'Invalid email format' };
    }

    return { isValid: true };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }

    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
        return {
            isValid: false,
            message: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`
        };
    }

    if (password.length > VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
        return {
            isValid: false,
            message: `Password cannot exceed ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`
        };
    }

    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
        return {
            isValid: false,
            message: 'Password must contain at least one letter and one number'
        };
    }

    return { isValid: true };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result
 */
export const validateUsername = (username) => {
    if (!username) {
        return { isValid: false, message: 'Username is required' };
    }

    if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
        return {
            isValid: false,
            message: `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters long`
        };
    }

    if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
        return {
            isValid: false,
            message: `Username cannot exceed ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters`
        };
    }

    // Only allow alphanumeric characters, underscores, and hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        return {
            isValid: false,
            message: 'Username can only contain letters, numbers, underscores, and hyphens'
        };
    }

    return { isValid: true };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} - Validation result
 */
export const validatePhone = (phone) => {
    if (!phone) {
        return { isValid: true }; // Phone is optional
    }

    if (!validator.isMobilePhone(phone, 'any')) {
        return { isValid: false, message: 'Invalid phone number format' };
    }

    return { isValid: true };
};

/**
 * Sanitize input string
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return validator.trim(validator.escape(input));
};

export default {
    validateEmail,
    validatePassword,
    validateUsername,
    validatePhone,
    sanitizeInput,
};
