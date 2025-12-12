import Item from '../models/Item.model.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.util.js';
import { STATUS_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES, PAGINATION } from '../config/constants.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

/**
 * Item Controller
 * Handles CRUD operations for lost and found items
 */

/**
 * Get all items with pagination and filtering
 * @route GET /api/items
 */
export const getAllItems = asyncHandler(async (req, res) => {
    const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        type,
        category,
        status,
        search,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    // Get items
    const items = await Item.find(filter)
        .populate('owner', 'username email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Item.countDocuments(filter);

    paginatedResponse(res, items, pageNum, limitNum, total);
});

/**
 * Get item by ID
 * @route GET /api/items/:id
 */
export const getItemById = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id)
        .populate('owner', 'username email avatar phone')
        .populate('claimedBy', 'username email');

    if (!item) {
        return errorResponse(
            res,
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.ITEM_NOT_FOUND
        );
    }

    successResponse(
        res,
        STATUS_CODES.OK,
        'Item retrieved successfully',
        { item }
    );
});

/**
 * Create new item
 * @route POST /api/items
 */
export const createItem = asyncHandler(async (req, res) => {
    const itemData = {
        ...req.body,
        owner: req.user._id,
    };

    const item = await Item.create(itemData);

    // Populate owner info
    await item.populate('owner', 'username email avatar');

    successResponse(
        res,
        STATUS_CODES.CREATED,
        SUCCESS_MESSAGES.ITEM_CREATED,
        { item }
    );
});

/**
 * Update item
 * @route PUT /api/items/:id
 */
export const updateItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        return errorResponse(
            res,
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.ITEM_NOT_FOUND
        );
    }

    // Check if user is the owner
    if (item.owner.toString() !== req.user._id.toString()) {
        return errorResponse(
            res,
            STATUS_CODES.FORBIDDEN,
            ERROR_MESSAGES.UNAUTHORIZED_ITEM_ACCESS
        );
    }

    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('owner', 'username email avatar');

    successResponse(
        res,
        STATUS_CODES.OK,
        SUCCESS_MESSAGES.ITEM_UPDATED,
        { item: updatedItem }
    );
});

/**
 * Delete item
 * @route DELETE /api/items/:id
 */
export const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        return errorResponse(
            res,
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.ITEM_NOT_FOUND
        );
    }

    // Check if user is the owner
    if (item.owner.toString() !== req.user._id.toString()) {
        return errorResponse(
            res,
            STATUS_CODES.FORBIDDEN,
            ERROR_MESSAGES.UNAUTHORIZED_ITEM_ACCESS
        );
    }

    await item.deleteOne();

    successResponse(
        res,
        STATUS_CODES.OK,
        SUCCESS_MESSAGES.ITEM_DELETED
    );
});

/**
 * Get user's items
 * @route GET /api/items/user/:userId
 */
export const getUserItems = asyncHandler(async (req, res) => {
    const items = await Item.findByUser(req.params.userId);

    successResponse(
        res,
        STATUS_CODES.OK,
        'User items retrieved successfully',
        { items }
    );
});

/**
 * Mark item as claimed
 * @route POST /api/items/:id/claim
 */
export const claimItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        return errorResponse(
            res,
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.ITEM_NOT_FOUND
        );
    }

    if (!item.isClaimable) {
        return errorResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Item is not claimable'
        );
    }

    await item.markAsClaimed(req.user._id);

    successResponse(
        res,
        STATUS_CODES.OK,
        'Item marked as claimed successfully',
        { item }
    );
});

export default {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getUserItems,
    claimItem,
};
