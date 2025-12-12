import User from '../models/User.model.js';
import { successResponse, errorResponse } from '../utils/response.util.js';
import { STATUS_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

/**
 * User Controller
 * Handles user profile operations
 */

/**
 * Get user profile by ID
 * @route GET /api/users/:id
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

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
 * Update user profile
 * @route PUT /api/users/:id
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
    // Check if user is updating their own profile
    if (req.params.id !== req.user._id.toString()) {
        return errorResponse(
            res,
            STATUS_CODES.FORBIDDEN,
            'You can only update your own profile'
        );
    }

    const { username, phone, location, bio, avatar } = req.body;

    // Prevent updating sensitive fields
    const updateData = {};
    if (username) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    );

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
        SUCCESS_MESSAGES.USER_UPDATED,
        { user: user.getPublicProfile() }
    );
});

/**
 * Delete user account
 * @route DELETE /api/users/:id
 */
export const deleteUserAccount = asyncHandler(async (req, res) => {
    // Check if user is deleting their own account
    if (req.params.id !== req.user._id.toString()) {
        return errorResponse(
            res,
            STATUS_CODES.FORBIDDEN,
            'You can only delete your own account'
        );
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return errorResponse(
            res,
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND
        );
    }

    // Soft delete - deactivate account
    user.isActive = false;
    await user.save();

    successResponse(
        res,
        STATUS_CODES.OK,
        SUCCESS_MESSAGES.USER_DELETED
    );
});

export default {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
};
