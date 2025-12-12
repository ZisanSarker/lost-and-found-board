import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

/**
 * User Model Schema
 * Defines the structure and validation for user documents
 */

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, 'Please provide a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false, // Don't include password in queries by default
        },
        avatar: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    // Allow empty string or valid phone number
                    return !v || validator.isMobilePhone(v, 'any', { strictMode: false });
                },
                message: 'Please provide a valid phone number',
            },
        },
        location: {
            type: String,
            trim: true,
            maxlength: [100, 'Location cannot exceed 100 characters'],
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Mongoose will automatically create indexes for unique fields
// No need to explicitly call schema.index() for them

/**
 * Pre-save middleware to hash password
 */
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Method to compare password for login
 * @param {string} candidatePassword - The password to compare
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Method to get public user profile (without sensitive data)
 * @returns {Object} - Public user data
 */
userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;

    // Map MongoDB _id to id for frontend compatibility
    if (userObject._id) {
        userObject.id = userObject._id.toString();
        delete userObject._id;
    }

    return userObject;
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
