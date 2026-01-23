import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload, uploadToCloudinary } from '../utils/upload.util.js';
import { successResponse, errorResponse } from '../utils/response.util.js';
import { STATUS_CODES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/upload/image
 * @desc    Upload a single image
 * @access  Private
 */
router.post(
    '/image',
    authenticate,
    upload.single('image'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return errorResponse(
                res,
                STATUS_CODES.BAD_REQUEST,
                'No image file provided'
            );
        }

        const result = await uploadToCloudinary(req.file.buffer);

        successResponse(
            res,
            STATUS_CODES.OK,
            'Image uploaded successfully',
            {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
            }
        );
    })
);

/**
 * @route   POST /api/upload/images
 * @desc    Upload multiple images (up to 5)
 * @access  Private
 */
router.post(
    '/images',
    authenticate,
    upload.array('images', 5),
    asyncHandler(async (req, res) => {
        if (!req.files || req.files.length === 0) {
            return errorResponse(
                res,
                STATUS_CODES.BAD_REQUEST,
                'No image files provided'
            );
        }

        const uploadPromises = req.files.map((file) =>
            uploadToCloudinary(file.buffer)
        );

        const results = await Promise.all(uploadPromises);

        const images = results.map((result) => ({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        }));

        successResponse(
            res,
            STATUS_CODES.OK,
            `${images.length} image(s) uploaded successfully`,
            { images }
        );
    })
);

export default router;
