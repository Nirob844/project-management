import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { PriorityQueueService } from '../tasks/priority-queue.service';
import { SearchService } from './search.service';

@Module({
  imports: [ConfigModule, CacheModule],
  providers: [SearchService, PriorityQueueService],
  exports: [SearchService, PriorityQueueService],
})
export class SearchModule {}
