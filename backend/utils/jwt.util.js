import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants.js';

/**
 * JWT Utility Functions
 * Handles token generation and verification
 */

/**
 * Generate access token
 * @param {Object} payload - Data to encode in the token
 * @returns {string} - Generated JWT token
 */
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
    });
};

/**
 * Generate refresh token
 * @param {Object} payload - Data to encode in the token
 * @returns {string} - Generated refresh token
 */
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
    });
};

/**
 * Verify access token
 * @param {string} token - Token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - Data to encode in tokens
 * @returns {Object} - Object containing both tokens
 */
export const generateTokens = (payload) => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateTokens,
};
