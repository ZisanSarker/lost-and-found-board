import mongoose from 'mongoose';
import crypto from 'crypto';
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
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
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
            required: [function () { return !this.googleId && !this.githubId; }, 'Password is required'],
            minlength: [3, 'Password must be at least 3 characters'],
            select: false, // Don't include password in queries by default
        },
        googleId: {
            type: String,
            sparse: true,
        },
        githubId: {
            type: String,
            sparse: true,
        },
        provider: {
            type: String,
            enum: ['local', 'google', 'github'],
            default: 'local',
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
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
            select: false,
        },
        emailVerificationExpires: {
            type: Date,
            select: false,
        },
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
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
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password') || !this.password) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
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
 * Generate email verification token
 * @returns {string} - Plain text token to send via email
 */
userSchema.methods.generateEmailVerificationToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return token;
};

/**
 * Generate password reset token
 * @returns {string} - Plain text token to send via email
 */
userSchema.methods.generatePasswordResetToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    return token;
};

/**
 * Method to get public user profile (without sensitive data)
 * @returns {Object} - Public user data
 */
userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    delete userObject.emailVerificationToken;
    delete userObject.emailVerificationExpires;
    delete userObject.passwordResetToken;
    delete userObject.passwordResetExpires;

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
