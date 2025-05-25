import { Injectable } from '@nestjs/common';
import { Priority, Task } from '@prisma/client';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PriorityQueueService {
  private readonly QUEUE_KEY = 'task_priority_queue';
  private readonly PRIORITY_WEIGHTS = {
    [Priority.URGENT]: 4,
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1,
  };

  constructor(private cache: CacheService) {}

  async addTask(task: Task) {
    const score = this.calculatePriorityScore(task);
    await this.cache.zadd(this.QUEUE_KEY, score, task.id);
  }

  async removeTask(taskId: string) {
    await this.cache.zrem(this.QUEUE_KEY, taskId);
  }

  async updateTaskPriority(task: Task) {
    const score = this.calculatePriorityScore(task);
    await this.cache.zadd(this.QUEUE_KEY, score, task.id);
  }

  async getNextTasks(limit: number = 10): Promise<string[]> {
    // Get tasks with highest priority (highest scores)
    return await this.cache.zrevrange(this.QUEUE_KEY, 0, limit - 1);
  }

  async getTaskPosition(taskId: string): Promise<number> {
    // Get the rank of the task in the queue (0-based index)
    return (await this.cache.zrevrank(this.QUEUE_KEY, taskId)) ?? -1;
  }

  private calculatePriorityScore(task: Task): number {
    const baseScore = this.PRIORITY_WEIGHTS[task.priority] * 1000;

    // Add time-based component (tasks due sooner get higher priority)
    let timeScore = 0;
    if (task.dueDate) {
      const daysUntilDue = this.getDaysUntilDue(task.dueDate);
      timeScore = Math.max(0, 1000 - daysUntilDue * 100);
    }

    // Add status-based component
    const statusScore = task.status === 'IN_PROGRESS' ? 500 : 0;

    return baseScore + timeScore + statusScore;
  }

  private getDaysUntilDue(dueDate: Date): number {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
