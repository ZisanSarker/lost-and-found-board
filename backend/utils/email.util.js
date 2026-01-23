import nodemailer from 'nodemailer';

/**
 * Email Utility
 * Handles sending emails for verification, password reset, and notifications
 */

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    },
});

const APP_NAME = process.env.APP_NAME || 'Lost and Found Board';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4200';

/**
 * Send email verification link
 * @param {string} to - Recipient email
 * @param {string} token - Verification token
 */
export const sendVerificationEmail = async (to, token) => {
    const verificationUrl = `${CLIENT_URL}/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: `"${APP_NAME}" <${process.env.NODEMAILER_USER}>`,
        to,
        subject: `Verify your email - ${APP_NAME}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #f97316; text-align: center;">Welcome to ${APP_NAME}!</h2>
                <p style="color: #374151; font-size: 16px;">
                    Thank you for signing up. Please verify your email address by clicking the button below:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}"
                       style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Verify Email
                    </a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">
                    If you didn't create an account, you can safely ignore this email.
                </p>
                <p style="color: #6b7280; font-size: 14px;">
                    This link will expire in 24 hours.
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    ${APP_NAME} - Helping communities reunite with their belongings
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Send password reset link
 * @param {string} to - Recipient email
 * @param {string} token - Reset token
 */
export const sendPasswordResetEmail = async (to, token) => {
    const resetUrl = `${CLIENT_URL}/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: `"${APP_NAME}" <${process.env.NODEMAILER_USER}>`,
        to,
        subject: `Reset your password - ${APP_NAME}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #f97316; text-align: center;">Password Reset Request</h2>
                <p style="color: #374151; font-size: 16px;">
                    You requested a password reset. Click the button below to set a new password:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}"
                       style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">
                    If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.
                </p>
                <p style="color: #6b7280; font-size: 14px;">
                    This link will expire in 1 hour.
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    ${APP_NAME} - Helping communities reunite with their belongings
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Send welcome email after successful verification
 * @param {string} to - Recipient email
 * @param {string} username - User's name
 */
export const sendWelcomeEmail = async (to, username) => {
    const mailOptions = {
        from: `"${APP_NAME}" <${process.env.NODEMAILER_USER}>`,
        to,
        subject: `Welcome to ${APP_NAME}!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #f97316; text-align: center;">Welcome, ${username}!</h2>
                <p style="color: #374151; font-size: 16px;">
                    Your email has been verified and your account is now active. You can now:
                </p>
                <ul style="color: #374151; font-size: 14px; line-height: 1.8;">
                    <li>Post lost or found items</li>
                    <li>Search for your missing belongings</li>
                    <li>Help others find their lost items</li>
                    <li>Connect with finders/owners</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${CLIENT_URL}/dashboard"
                       style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Go to Dashboard
                    </a>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    ${APP_NAME} - Helping communities reunite with their belongings
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Send item claim notification to item owner
 * @param {string} to - Owner's email
 * @param {Object} item - The claimed item
 * @param {string} claimerName - Name of the person claiming
 */
export const sendClaimNotificationEmail = async (to, item, claimerName) => {
    const itemUrl = `${CLIENT_URL}/item-detail/${item._id}`;

    const mailOptions = {
        from: `"${APP_NAME}" <${process.env.NODEMAILER_USER}>`,
        to,
        subject: `Someone claimed your ${item.type} item - ${APP_NAME}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #f97316; text-align: center;">Item Claimed!</h2>
                <p style="color: #374151; font-size: 16px;">
                    <strong>${claimerName}</strong> has claimed your ${item.type} item: <strong>"${item.title}"</strong>
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${itemUrl}"
                       style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        View Item
                    </a>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    ${APP_NAME} - Helping communities reunite with their belongings
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export default {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendClaimNotificationEmail,
};
