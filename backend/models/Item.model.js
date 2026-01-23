import mongoose from 'mongoose';
import { ITEM_TYPES, ITEM_STATUS } from '../config/constants.js';

/**
 * Item Model Schema
 * Defines the structure for lost and found items
 */

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters long'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        type: {
            type: String,
            required: [true, 'Item type is required'],
            enum: {
                values: Object.values(ITEM_TYPES),
                message: 'Type must be either "lost" or "found"',
            },
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
            maxlength: [200, 'Location cannot exceed 200 characters'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        images: [{
            type: String,
            trim: true,
        }],
        status: {
            type: String,
            enum: Object.values(ITEM_STATUS),
            default: ITEM_STATUS.ACTIVE,
        },
        contactInfo: {
            type: String,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner is required'],
        },
        tags: [{
            type: String,
            trim: true,
            lowercase: true,
        }],
        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        claimedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
itemSchema.index({ type: 1, status: 1 });
itemSchema.index({ owner: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search index

/**
 * Virtual for checking if item is claimable
 */
itemSchema.virtual('isClaimable').get(function () {
    return this.status === ITEM_STATUS.ACTIVE;
});

/**
 * Method to mark item as claimed
 * @param {string} userId - The ID of the user claiming the item
 */
itemSchema.methods.markAsClaimed = function (userId) {
    this.status = ITEM_STATUS.CLAIMED;
    this.claimedBy = userId;
    this.claimedAt = new Date();
    return this.save();
};

/**
 * Method to close item listing
 */
itemSchema.methods.closeItem = function () {
    this.status = ITEM_STATUS.CLOSED;
    return this.save();
};

/**
 * Static method to find items by user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of items
 */
itemSchema.statics.findByUser = function (userId) {
    return this.find({ owner: userId }).populate('owner', 'username email avatar').sort({ createdAt: -1 });
};

/**
 * Static method to search items
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Array>} - Array of matching items
 */
itemSchema.statics.searchItems = function (searchParams) {
    const { query, type, category, status } = searchParams;
    const filter = {};

    if (query) {
        filter.$text = { $search: query };
    }
    if (type) {
        filter.type = type;
    }
    if (category) {
        filter.category = category;
    }
    if (status) {
        filter.status = status;
    } else {
        filter.status = ITEM_STATUS.ACTIVE; // Default to active items
    }

    return this.find(filter).populate('owner', 'username email avatar').sort({ createdAt: -1 });
};

// Create and export the Item model
const Item = mongoose.model('Item', itemSchema);

export default Item;
