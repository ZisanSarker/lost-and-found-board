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
        console.log(`✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

        mongoose.connection.on('error', (err) => {
            console.error(`✗ MongoDB error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✓ MongoDB reconnected');
        });

    } catch (error) {
        console.error(`✗ MongoDB connection failed: ${error.message}`);
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
