import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_KEYS = {
    COMMENT: (id: string) => `comment:${id}`,
    TASK_COMMENTS: (taskId: string) => `task:${taskId}:comments`,
  };

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private notifications: NotificationsService,
  ) {}

  async create(dto: CreateCommentDto, userId: string) {
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        taskId: dto.taskId,
        userId,
      },
      include: {
        user: true,
        task: true,
      },
    });

    // Invalidate cache
    await this.cache.del(this.CACHE_KEYS.TASK_COMMENTS(dto.taskId));

    // Notify about new comment
    await this.notifications.notifyNewComment(
      dto.taskId,
      comment.id,
      userId,
      dto.content,
    );

    return comment;
  }

  async findAll() {
    const cacheKey = 'comments:all';
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const comments = await this.prisma.comment.findMany({
      include: {
        user: true,
        task: true,
      },
    });

    await this.cache.set(cacheKey, comments, this.CACHE_TTL);
    return comments;
  }

  async findOne(id: string) {
    const cacheKey = this.CACHE_KEYS.COMMENT(id);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,
        task: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.cache.set(cacheKey, comment, this.CACHE_TTL);
    return comment;
  }

  async findByTask(taskId: string) {
    const cacheKey = this.CACHE_KEYS.TASK_COMMENTS(taskId);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const comments = await this.prisma.comment.findMany({
      where: { taskId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cache.set(cacheKey, comments, this.CACHE_TTL);
    return comments;
  }

  async update(id: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: dto,
      include: {
        user: true,
        task: true,
      },
    });

    // Invalidate cache
    await this.cache.del(this.CACHE_KEYS.COMMENT(id));
    await this.cache.invalidatePattern(
      this.CACHE_KEYS.TASK_COMMENTS(comment.taskId),
    );

    return updatedComment;
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    // Invalidate cache
    await this.cache.del(this.CACHE_KEYS.COMMENT(id));
    await this.cache.invalidatePattern(
      this.CACHE_KEYS.TASK_COMMENTS(comment.taskId),
    );

    return { message: 'Comment deleted successfully' };
  }
}
