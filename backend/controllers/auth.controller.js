import User from '../models/User.model.js';
import { generateTokens, generateAccessToken, verifyRefreshToken } from '../utils/jwt.util.js';
import { successResponse, errorResponse } from '../utils/response.util.js';
import { STATUS_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

/**
 * Authentication Controller
 * Handles user registration, login, logout, and token management
 */

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        if (existingUser.email === email) {
            return errorResponse(
                res,
                STATUS_CODES.CONFLICT,
                ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
            );
        }
        return errorResponse(
            res,
            STATUS_CODES.CONFLICT,
            'Username already taken'
        );
    }

    // Create new user
    const user = await User.create({
        username,
        email,
        password,
    });

    // Generate tokens
    const tokens = generateTokens({ id: user._id, email: user.email });

    // Send response
    successResponse(
        res,
        STATUS_CODES.CREATED,
        SUCCESS_MESSAGES.USER_CREATED,
        {
            user: user.getPublicProfile(),
            ...tokens,
        }
    );
});

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return errorResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            ERROR_MESSAGES.INVALID_CREDENTIALS
        );
    }

    // Check if account is active
    if (!user.isActive) {
        return errorResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            'Account is deactivated'
        );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return errorResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            ERROR_MESSAGES.INVALID_CREDENTIALS
        );
    }

    // Generate tokens
    const tokens = generateTokens({ id: user._id, email: user.email });

    // Send response
    successResponse(
        res,
        STATUS_CODES.OK,
        SUCCESS_MESSAGES.LOGIN_SUCCESS,
        {
            user: user.getPublicProfile(),
            ...tokens,
        }
    );
});

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return errorResponse(
            res,
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND
        );
    }

    successResponse(
        res,
        STATUS_CODES.OK,
        'User profile retrieved successfully',
        { user: user.getPublicProfile() }
    );
});

/**
 * Logout user
 * @route POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
    // In a real app, you might want to invalidate the refresh token here
    // For now, we'll just send a success response
    successResponse(
        res,
        STATUS_CODES.OK,
        SUCCESS_MESSAGES.LOGOUT_SUCCESS
    );
});

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 */
export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return errorResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Refresh token is required'
        );
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);

        // Generate new access token
        const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

        successResponse(
            res,
            STATUS_CODES.OK,
            'Token refreshed successfully',
            { accessToken }
        );
    } catch (error) {
        return errorResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            ERROR_MESSAGES.INVALID_TOKEN
        );
    }
});

export default {
    register,
    login,
    getCurrentUser,
    logout,
    refreshToken,
};
