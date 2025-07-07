// Import ioredis using ES module syntax
import Redis from "ioredis";

// Check if the environment variable is set
let redisEnabled = true;
if (!process.env.REDIS_URL || process.env.REDIS_URL.startsWith('-1')) {
    console.warn('Redis is disabled, REDIS_URL is not set or set to -1');
    redisEnabled = false;
}

// Create a Redis instance
const redis = redisEnabled ? new Redis(process.env.REDIS_URL) : {
    set: async () => { console.warn('Redis is disabled, set operation not performed'); },
    get: async () => { console.warn('Redis is disabled, get operation not performed'); },
    status: 'disabled'
};

// Set a key
export async function redisSet(key, value, options = []) {
    // options can be e.g. ["EX", 10]
    return await redis.set(key, value, ...options);
}

// Get a key (Promise style)
export async function redisGet(key) {
    return await redis.get(key);
}

export async function isRedisConnected() {
    try {
        // Check if the Redis client is connected
        return redis.status === 'ready';
    } catch (error) {
        console.error('Redis connection error:', error);
        return false;
    }
}