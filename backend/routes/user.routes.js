import express from 'express';
import { body } from 'express-validator';
import {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validation.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile
 * @access  Public
 */
router.get('/:id', getUserProfile);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private (Self only)
 */
router.put(
    '/:id',
    authenticate,
    [
        body('username')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        body('phone')
            .optional()
            .trim()
            .isMobilePhone()
            .withMessage('Please provide a valid phone number'),
        body('location')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Location cannot exceed 100 characters'),
        body('bio')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Bio cannot exceed 500 characters'),
        validate,
    ],
    updateUserProfile
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user account
 * @access  Private (Self only)
 */
router.delete('/:id', authenticate, deleteUserAccount);

export default router;
