import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

@Module({
  imports: [CacheModule],
  providers: [RateLimitMiddleware],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
