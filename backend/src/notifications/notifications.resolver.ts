import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

@Resolver(() => Notification)
@UseGuards(JwtAuthGuard)
export class NotificationsResolver {
  constructor(private notificationsService: NotificationsService) {}

  @Query(() => [Notification])
  async myNotifications(@CurrentUser() user: any) {
    return this.notificationsService.findAll(user.id);
  }

  @Mutation(() => Notification)
  async markNotificationAsRead(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Mutation(() => Notification)
  async markAllNotificationsAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Mutation(() => Notification)
  async deleteNotification(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.delete(id, user.id);
  }
}
