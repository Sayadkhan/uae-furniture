const rateLimitMap = new Map();

/**
 * Simple in-memory rate limiter for Server Actions
 * @param {string} ip - User's IP address
 * @param {Object} options - { limit: number, windowMs: number }
 * @returns {Promise<boolean>} - true if allowed, false if limited
 */
export async function rateLimit(ip, { limit = 5, windowMs = 60000 } = {}) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > userData.resetTime) {
    userData.count = 1;
    userData.resetTime = now + windowMs;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  if (userData.count > limit) {
    return false;
  }

  return true;
}
