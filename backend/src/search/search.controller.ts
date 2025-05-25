import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PriorityQueueService } from '../tasks/priority-queue.service';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SearchController {
  constructor(
    private searchService: SearchService,
    private priorityQueue: PriorityQueueService,
  ) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('projectId') projectId?: string,
    @Query('assigneeId') assigneeId?: string,
  ) {
    const filters = {
      type,
      status,
      priority,
      projectId,
      assigneeId,
    };

    return this.searchService.search(query, filters);
  }

  @Get('priority-queue')
  @Roles(Role.PROJECT_MANAGER, Role.ADMIN)
  async getPriorityQueue(@Query('limit') limit?: number) {
    const taskIds = await this.priorityQueue.getNextTasks(limit);
    return taskIds;
  }

  @Get('priority-queue/position/:taskId')
  async getTaskPosition(@Query('taskId') taskId: string) {
    const position = await this.priorityQueue.getTaskPosition(taskId);
    return { position };
  }
}
