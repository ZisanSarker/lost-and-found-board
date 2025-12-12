import mongoose from 'mongoose';

/**
 * MongoDB Database Connection Configuration
 * Handles connection, disconnection, error handling, and reconnection logic
 */

/**
 * MongoDB connection options
 */
const connectionOptions = {
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 5, // Minimum number of connections in the pool
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // Timeout for initial connection
};

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);

        // Handle connection events
        mongoose.connection.on('connected', () => {
            // Connected to database
        });

        mongoose.connection.on('error', (err) => {
            // Connection error
        });

        mongoose.connection.on('disconnected', () => {
            // Disconnected from database
        });

        mongoose.connection.on('reconnected', () => {
            // Reconnected to database
        });

    } catch (error) {
        // Exit process with failure
        process.exit(1);
    }
};

/**
 * Gracefully close database connection
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        throw error;
    }
};

export default {
    connectDB,
    disconnectDB,
};
