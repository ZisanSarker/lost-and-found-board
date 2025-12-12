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

        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        console.log(`  Database: ${conn.connection.name}`);

        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('✓ Mongoose connected to database');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`✗ Mongoose connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠ Mongoose disconnected from database');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✓ Mongoose reconnected to database');
        });

    } catch (error) {
        console.error(`✗ MongoDB Connection Error: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
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
        console.log('✓ Database connection closed gracefully');
    } catch (error) {
        console.error(`✗ Error closing database connection: ${error.message}`);
        throw error;
    }
};

export default {
    connectDB,
    disconnectDB,
};
