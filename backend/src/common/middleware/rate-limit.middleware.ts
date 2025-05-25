import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly WINDOW_SIZE = 60; // 1 minute in seconds
  private readonly MAX_REQUESTS = 100; // max requests per window

  constructor(private cache: CacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const key = `ratelimit:${req.ip}`;
    const current = (await this.cache.get<number>(key)) || 0;

    if (current >= this.MAX_REQUESTS) {
      return res.status(429).json({
        statusCode: 429,
        message: 'Too Many Requests',
        retryAfter: this.WINDOW_SIZE,
      });
    }

    await this.cache.set(key, current + 1, this.WINDOW_SIZE);
    res.setHeader('X-RateLimit-Limit', this.MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', this.MAX_REQUESTS - (current + 1));
    res.setHeader(
      'X-RateLimit-Reset',
      Math.floor(Date.now() / 1000) + this.WINDOW_SIZE,
    );

    next();
  }
}
