import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [ConfigModule, PrismaModule, CacheModule],
  providers: [
    NotificationsService,
    NotificationsResolver,
    NotificationsGateway,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
