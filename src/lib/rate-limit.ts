import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Sliding window limiters per endpoint type
const limiters = {
  // 5 attempts per 15 minutes — credentials login
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'rl:login',
  }),
  // 3 attempts per hour — registration
  register: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'rl:register',
  }),
  // 3 attempts per hour — forgot password
  forgotPassword: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'rl:forgot-password',
  }),
  // 5 attempts per 15 minutes — password reset
  resetPassword: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'rl:reset-password',
  }),
  // 3 attempts per 15 minutes — resend verification
  resendVerification: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '15 m'),
    prefix: 'rl:resend-verification',
  }),
} as const;

export type LimiterKey = keyof typeof limiters;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp (ms)
}

/**
 * Check rate limit for the given key and identifier.
 * Fails open — if Redis is unavailable, allows the request through.
 */
export async function checkRateLimit(
  limiterKey: LimiterKey,
  identifier: string
): Promise<RateLimitResult> {
  try {
    const result = await limiters[limiterKey].limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    // Fail open: don't block users if Redis is down
    return { success: true, remaining: 0, reset: 0 };
  }
}

/**
 * Extract the client IP from a Request, with fallback for local dev.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

/**
 * Seconds until the rate limit window resets.
 */
export function retryAfterSeconds(reset: number): number {
  return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
}
