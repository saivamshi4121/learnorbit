// src/config/redisClient.js
const Redis = require('ioredis');
const logger = require('../utils/logger');

/**
 * Redis Client Configuration
 * Provides distributed caching and rate limiting
 * Gracefully degrades if Redis is unavailable
 */

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    // Stop retrying completely if local dev and no redis
    if (process.env.NODE_ENV !== 'production' && times > 3) {
      return null; // Stops retrying
    }
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  maxRetriesPerRequest: null, // Allow queuing commands while disconnected
  enableReadyCheck: false,
  lazyConnect: true, // Important: Don't crash app start if Redis is down
};

const redis = new Redis(redisConfig);

// Track connection status
let isConnected = false;

redis.on('connect', () => {
  logger.info('Redis client connecting...');
});

redis.on('ready', () => {
  isConnected = true;
  logger.info('✓ Redis client connected and ready');
});

redis.on('error', (err) => {
  isConnected = false;
  logger.error(`Redis connection error: ${err.message}`);
});

redis.on('close', () => {
  isConnected = false;
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('Redis client reconnecting...');
});

/**
 * Safe wrapper for Redis operations
 * Returns null if Redis is unavailable
 */
const safeRedisOperation = async (operation, fallbackValue = null) => {
  if (!isConnected) {
    logger.warn('Redis operation skipped - not connected');
    return fallbackValue;
  }
  try {
    return await operation();
  } catch (err) {
    logger.error(`Redis operation failed: ${err.message}`);
    return fallbackValue;
  }
};

// Export both the client and helper
module.exports = redis;
module.exports.safeRedisOperation = safeRedisOperation;
module.exports.isConnected = () => isConnected;
