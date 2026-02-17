const Redis = require('ioredis');
require('dotenv').config();
const logger = require('../utils/logger');

// Retrieve Redis URL from environment variables
const redisUrl = process.env.REDIS_URL;

// Throw error if REDIS_URL is missing
if (!redisUrl) {
    throw new Error('REDIS_URL environment variable is missing');
}

// Determine if we are in production
const isProduction = process.env.NODE_ENV === 'production';

// Configuration options
const options = {
    maxRetriesPerRequest: null, // Essential for robust queue processing
    enableReadyCheck: false,
    retryStrategy(times) {
        // Exponential backoff with max delay of 3s
        const delay = Math.min(times * 50, 3000);
        return delay;
    }
};

// Enable TLS automatically in production (Render requirement)
if (isProduction) {
    options.tls = {}; // Enforce strict TLS validation for production security
}

// Create Redis instance
const redis = new Redis(redisUrl, options);

// Connection logging
redis.on('connect', () => {
    logger.info('Redis connection established');
});

redis.on('ready', () => {
    logger.info('Redis client ready');
});

redis.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

redis.on('close', () => {
    logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
    logger.info('Redis reconnecting...');
});

// Helper for connection status (compatibility with existing middleware)
redis.isConnected = () => redis.status === 'ready';

// Export the instance
module.exports = redis;
