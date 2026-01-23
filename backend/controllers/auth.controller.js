import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.model.js';
import { generateTokens, generateAccessToken, verifyRefreshToken } from '../utils/jwt.util.js';
import { successResponse, errorResponse } from '../utils/response.util.js';
import { STATUS_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email.util.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return errorResponse(
            res,
            STATUS_CODES.CONFLICT,
            ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
        );
    }

    // Create new user
    const user = await User.create({
        username,
        email,
        password,
    });

    // Generate email verification token and send email
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    try {
        await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
        // Don't block registration if email fails
        console.error('Failed to send verification email:', emailError.message);
    }

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
 * Google OAuth authentication
 * @route POST /api/auth/google
 */
export const googleAuth = asyncHandler(async (req, res) => {
    const { credential, access_token } = req.body;

    if (!credential && !access_token) {
        return errorResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Google credential or access token is required'
        );
    }

    let googleId, email, name, picture;

    if (credential) {
        // Verify ID token
        let ticket;
        try {
            ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        } catch (error) {
            return errorResponse(res, STATUS_CODES.UNAUTHORIZED, 'Invalid Google token');
        }
        const payload = ticket.getPayload();
        googleId = payload.sub;
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
    } else {
        // Verify access token by calling Google's userinfo endpoint
        try {
            const response = await fetch(
                `https://www.googleapis.com/oauth2/v3/userinfo`,
                { headers: { Authorization: `Bearer ${access_token}` } }
            );
            if (!response.ok) {
                return errorResponse(res, STATUS_CODES.UNAUTHORIZED, 'Invalid Google access token');
            }
            const userInfo = await response.json();
            googleId = userInfo.sub;
            email = userInfo.email;
            name = userInfo.name;
            picture = userInfo.picture;
        } catch (error) {
            return errorResponse(res, STATUS_CODES.UNAUTHORIZED, 'Failed to verify Google token');
        }
    }

    // Find existing user by googleId or email
    let user = await User.findOne({
        $or: [{ googleId }, { email }],
    });

    if (user) {
        // If user exists with email but no googleId, link the account
        if (!user.googleId) {
            user.googleId = googleId;
            user.provider = 'google';
            if (!user.avatar && picture) {
                user.avatar = picture;
            }
            if (!user.isEmailVerified) {
                user.isEmailVerified = true;
            }
            await user.save({ validateBeforeSave: false });
        }
    } else {
        // Create new user
        user = await User.create({
            username: name,
            email,
            googleId,
            provider: 'google',
            avatar: picture || '',
            isEmailVerified: true,
        });
    }

    // Generate tokens
    const tokens = generateTokens({ id: user._id, email: user.email });

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

/**
 * Forgot password - send reset email
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        // Don't reveal whether email exists
        return successResponse(
            res,
            STATUS_CODES.OK,
            'If an account with that email exists, a password reset link has been sent.'
        );
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        await sendPasswordResetEmail(email, resetToken);
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return errorResponse(
            res,
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            'Failed to send reset email. Please try again later.'
        );
    }

    successResponse(
        res,
        STATUS_CODES.OK,
        'If an account with that email exists, a password reset link has been sent.'
    );
});

/**
 * Reset password with token
 * @route POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
        return errorResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Invalid or expired reset token'
        );
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const tokens = generateTokens({ id: user._id, email: user.email });

    successResponse(
        res,
        STATUS_CODES.OK,
        'Password reset successful',
        {
            user: user.getPublicProfile(),
            ...tokens,
        }
    );
});

/**
 * Verify email address
 * @route GET /api/auth/verify-email/:token
 */
export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
        return errorResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Invalid or expired verification token'
        );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    try {
        await sendWelcomeEmail(user.email, user.username);
    } catch (error) {
        // Non-critical - don't block verification
    }

    successResponse(
        res,
        STATUS_CODES.OK,
        'Email verified successfully',
        { user: user.getPublicProfile() }
    );
});

/**
 * Resend email verification
 * @route POST /api/auth/resend-verification
 */
export const resendVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return errorResponse(
            res,
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND
        );
    }

    if (user.isEmailVerified) {
        return errorResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Email is already verified'
        );
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    try {
        await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
        return errorResponse(
            res,
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            'Failed to send verification email. Please try again later.'
        );
    }

    successResponse(
        res,
        STATUS_CODES.OK,
        'Verification email sent successfully'
    );
});

/**
 * GitHub OAuth - redirect to GitHub
 * @route GET /api/auth/github
 */
export const githubAuth = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL}/api/auth/github/callback`,
        scope: 'user:email',
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

/**
 * GitHub OAuth callback
 * @route GET /api/auth/github/callback
 */
export const githubCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;
    const clientUrl = process.env.CLIENT_URL;

    if (!code) {
        return res.redirect(`${clientUrl}/auth/github-callback?error=${encodeURIComponent('Authorization code missing')}`);
    }

    // Exchange code for access token
    let accessToken;
    try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) {
            return res.redirect(`${clientUrl}/auth/github-callback?error=${encodeURIComponent(tokenData.error_description || 'Failed to get access token')}`);
        }
        accessToken = tokenData.access_token;
    } catch (error) {
        return res.redirect(`${clientUrl}/auth/github-callback?error=${encodeURIComponent('Failed to exchange code for token')}`);
    }

    // Get user info from GitHub
    let githubUser, emails;
    try {
        const [userRes, emailRes] = await Promise.all([
            fetch('https://api.github.com/user', {
                headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'Lost-And-Found-App' },
            }),
            fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'Lost-And-Found-App' },
            }),
        ]);
        githubUser = await userRes.json();
        emails = await emailRes.json();
    } catch (error) {
        return res.redirect(`${clientUrl}/auth/github-callback?error=${encodeURIComponent('Failed to fetch GitHub user info')}`);
    }

    const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email || githubUser.email;
    if (!primaryEmail) {
        return res.redirect(`${clientUrl}/auth/github-callback?error=${encodeURIComponent('No email associated with this GitHub account')}`);
    }

    const githubId = String(githubUser.id);

    // Find or create user
    let user = await User.findOne({
        $or: [{ githubId }, { email: primaryEmail }],
    });

    if (user) {
        if (!user.githubId) {
            user.githubId = githubId;
            user.provider = 'github';
            if (!user.avatar && githubUser.avatar_url) {
                user.avatar = githubUser.avatar_url;
            }
            if (!user.isEmailVerified) {
                user.isEmailVerified = true;
            }
            await user.save({ validateBeforeSave: false });
        }
    } else {
        user = await User.create({
            username: githubUser.name || githubUser.login,
            email: primaryEmail,
            githubId,
            provider: 'github',
            avatar: githubUser.avatar_url || '',
            isEmailVerified: true,
        });
    }

    // Generate tokens
    const tokens = generateTokens({ id: user._id, email: user.email });

    const data = encodeURIComponent(JSON.stringify({
        accessToken: tokens.accessToken,
        user: user.getPublicProfile(),
    }));

    res.redirect(`${clientUrl}/auth/github-callback?data=${data}`);
});

export default {
    register,
    login,
    googleAuth,
    githubAuth,
    githubCallback,
    getCurrentUser,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
};
