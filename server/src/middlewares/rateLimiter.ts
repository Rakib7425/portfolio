import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisService } from '../utils/redis';
import { config } from '../config';

// General rate limiter for public APIs
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.env === 'development',
  ...(redisService.getClient() && {
    store: new RedisStore({
      // @ts-expect-error - RedisStore types are outdated
      client: redisService.getClient(),
      prefix: 'rl:general:',
    }),
  }),
});

// Stricter rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 requests per window
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.env === 'development',
  ...(redisService.getClient() && {
    store: new RedisStore({
      // @ts-expect-error - RedisStore types are outdated
      client: redisService.getClient(),
      prefix: 'rl:auth:',
    }),
  }),
});

// API limiter for admin routes
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: 50, // Lower limit for admin routes
  message: 'Too many API requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.env === 'development',
  ...(redisService.getClient() && {
    store: new RedisStore({
      // @ts-expect-error - RedisStore types are outdated
      client: redisService.getClient(),
      prefix: 'rl:api:',
    }),
  }),
});

// Contact form specific limiter
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 submissions per hour
  message: 'Too many contact form submissions, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.env === 'development',
  ...(redisService.getClient() && {
    store: new RedisStore({
      // @ts-expect-error - RedisStore types are outdated
      client: redisService.getClient(),
      prefix: 'rl:contact:',
    }),
  }),
});
