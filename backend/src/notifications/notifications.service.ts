import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_KEYS = {
    NOTIFICATIONS: 'notifications:',
  };

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    userId: string,
    data: {
      title: string;
      message: string;
      type: NotificationType;
      data?: any;
    },
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        ...data,
        userId,
        data: data.data ? JSON.stringify(data.data) : null,
      },
    });

    await this.invalidateCache(userId);
    this.notificationsGateway.notifyUser(userId, notification);
    return notification;
  }

  async findAll(userId: string) {
    const cacheKey = this.CACHE_KEYS.NOTIFICATIONS + userId;
    const cachedNotifications = await this.cacheService.get(cacheKey);

    if (cachedNotifications && typeof cachedNotifications === 'string') {
      return JSON.parse(cachedNotifications);
    }

    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(notifications),
      this.CACHE_TTL,
    );
    return notifications;
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    await this.invalidateCache(userId);
    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    await this.invalidateCache(userId);
    return { message: 'All notifications marked as read' };
  }

  async delete(id: string, userId: string) {
    await this.prisma.notification.delete({
      where: { id },
    });

    await this.invalidateCache(userId);
    return { message: 'Notification deleted' };
  }

  private async invalidateCache(userId: string) {
    const key = this.CACHE_KEYS.NOTIFICATIONS + userId;
    await this.cacheService.del(key);
  }
}
