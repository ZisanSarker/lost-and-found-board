import express from 'express';
import { body } from 'express-validator';
import {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getUserItems,
    claimItem,
    resolveItem,
    getStats,
} from '../controllers/item.controller.js';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validation.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/items
 * @desc    Get all items (with pagination and filtering)
 * @access  Public
 */
router.get('/', optionalAuth, getAllItems);

/**
 * @route   GET /api/items/stats
 * @desc    Get platform statistics
 * @access  Public
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/items/user/:userId
 * @desc    Get items by user
 * @access  Public
 */
router.get('/user/:userId', getUserItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get item by ID
 * @access  Public
 */
router.get('/:id', getItemById);

/**
 * @route   POST /api/items
 * @desc    Create new item
 * @access  Private
 */
router.post(
    '/',
    authenticate,
    [
        body('title')
            .trim()
            .isLength({ min: 3, max: 200 })
            .withMessage('Title must be between 3 and 200 characters'),
        body('description')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Description must be between 10 and 2000 characters'),
        body('type')
            .isIn(['lost', 'found'])
            .withMessage('Type must be either "lost" or "found"'),
        body('category')
            .trim()
            .notEmpty()
            .withMessage('Category is required'),
        body('location')
            .trim()
            .isLength({ min: 3, max: 200 })
            .withMessage('Location must be between 3 and 200 characters'),
        body('date')
            .isISO8601()
            .withMessage('Please provide a valid date'),
        validate,
    ],
    createItem
);

/**
 * @route   PUT /api/items/:id
 * @desc    Update item
 * @access  Private (Owner only)
 */
router.put(
    '/:id',
    authenticate,
    [
        body('title')
            .optional()
            .trim()
            .isLength({ min: 3, max: 200 })
            .withMessage('Title must be between 3 and 200 characters'),
        body('description')
            .optional()
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Description must be between 10 and 2000 characters'),
        validate,
    ],
    updateItem
);

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete item
 * @access  Private (Owner only)
 */
router.delete('/:id', authenticate, deleteItem);

/**
 * @route   POST /api/items/:id/claim
 * @desc    Claim an item
 * @access  Private
 */
router.post('/:id/claim', authenticate, claimItem);

/**
 * @route   PATCH /api/items/:id/resolve
 * @desc    Mark item as resolved
 * @access  Private (Owner only)
 */
router.patch('/:id/resolve', authenticate, resolveItem);

export default router;
