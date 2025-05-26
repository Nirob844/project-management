import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType, Priority, Status } from '@prisma/client';
import { CacheService } from '../cache/cache.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Injectable()
export class TasksService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_KEYS = {
    TASK: 'task:',
    TASKS: 'tasks',
    USER_TASKS: 'user:tasks:',
    PROJECT_TASKS: 'project:tasks:',
  };

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private notificationsService: NotificationsService,
  ) {}

  async create(input: CreateTaskInput, creatorId: string) {
    const task = await this.prisma.task.create({
      data: {
        ...input,
        creatorId,
        status: Status.TODO,
        priority: input.priority || Priority.MEDIUM,
      },
      include: {
        project: true,
        assignee: true,
        creator: true,
        parentTask: true,
        subtasks: true,
      },
    });

    await this.invalidateCache();

    if (task.assigneeId) {
      await this.notificationsService.create(task.assigneeId, {
        title: 'Task Assigned',
        message: `You have been assigned to task: ${task.title}`,
        type: NotificationType.TASK_ASSIGNED,
        data: { taskId: task.id },
      });
    }

    return task;
  }

  async findAll() {
    const cacheKey = this.CACHE_KEYS.TASKS;
    const cachedTasks = (await this.cacheService.get(cacheKey)) as
      | string
      | null;

    if (cachedTasks) {
      return JSON.parse(cachedTasks);
    }

    const tasks = await this.prisma.task.findMany({
      include: {
        project: true,
        assignee: true,
        creator: true,
        parentTask: true,
        subtasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(tasks),
      this.CACHE_TTL,
    );
    return tasks;
  }

  async findOne(id: string) {
    const cacheKey = this.CACHE_KEYS.TASK + id;
    const cachedTask = (await this.cacheService.get(cacheKey)) as string | null;

    if (cachedTask) {
      return JSON.parse(cachedTask);
    }

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
        creator: true,
        parentTask: true,
        subtasks: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.cacheService.set(cacheKey, JSON.stringify(task), this.CACHE_TTL);
    return task;
  }

  async findByAssignee(assigneeId: string) {
    const cacheKey = this.CACHE_KEYS.USER_TASKS + assigneeId;
    const cachedTasks = (await this.cacheService.get(cacheKey)) as
      | string
      | null;

    if (cachedTasks) {
      return JSON.parse(cachedTasks);
    }

    const tasks = await this.prisma.task.findMany({
      where: { assigneeId },
      include: {
        project: true,
        assignee: true,
        creator: true,
        parentTask: true,
        subtasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(tasks),
      this.CACHE_TTL,
    );
    return tasks;
  }

  async findByProject(projectId: string) {
    const cacheKey = this.CACHE_KEYS.PROJECT_TASKS + projectId;
    const cachedTasks = (await this.cacheService.get(cacheKey)) as
      | string
      | null;

    if (cachedTasks) {
      return JSON.parse(cachedTasks);
    }

    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: {
        project: true,
        assignee: true,
        creator: true,
        parentTask: true,
        subtasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(tasks),
      this.CACHE_TTL,
    );
    return tasks;
  }

  async update(id: string, input: UpdateTaskInput) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
        creator: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: input,
      include: {
        project: true,
        assignee: true,
        creator: true,
        parentTask: true,
        subtasks: true,
      },
    });

    await this.invalidateCache(id);

    // Notify assignee of status change
    if (input.status && input.status !== task.status && task.assigneeId) {
      await this.notificationsService.create(task.assigneeId, {
        title: 'Task Status Updated',
        message: `Task "${task.title}" status changed to ${input.status}`,
        type: NotificationType.TASK_STATUS_CHANGED,
        data: { taskId: id },
      });
    }

    // Notify new assignee
    if (input.assigneeId && input.assigneeId !== task.assigneeId) {
      await this.notificationsService.create(input.assigneeId, {
        title: 'Task Assigned',
        message: `You have been assigned to task: ${task.title}`,
        type: NotificationType.TASK_ASSIGNED,
        data: { taskId: id },
      });
    }

    return updatedTask;
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
        creator: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.prisma.task.delete({
      where: { id },
    });

    await this.invalidateCache(id);

    // Notify assignee of task deletion
    if (task.assigneeId) {
      await this.notificationsService.create(task.assigneeId, {
        title: 'Task Deleted',
        message: `Task "${task.title}" has been deleted`,
        type: NotificationType.SYSTEM,
        data: { taskId: id },
      });
    }

    return { message: 'Task deleted successfully' };
  }

  private async invalidateCache(taskId?: string) {
    if (taskId) {
      await this.cacheService.del(this.CACHE_KEYS.TASK + taskId);
    }
    await this.cacheService.del(this.CACHE_KEYS.TASKS);
  }
}
