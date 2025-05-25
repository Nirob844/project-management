import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Task } from '../graphql/entities/task.entity';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver(() => Task)
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskResolver {
  constructor(private tasksService: TasksService) {}

  @Query(() => [Task])
  async tasks() {
    return this.tasksService.findAll();
  }

  @Query(() => Task)
  async task(@Args('id', { type: () => ID }) id: string) {
    return this.tasksService.findOne(id);
  }

  @Query(() => [Task])
  async tasksByProject(
    @Args('projectId', { type: () => ID }) projectId: string,
  ) {
    return this.tasksService.findByProject(projectId);
  }

  @Query(() => [Task])
  async tasksByAssignee(
    @Args('assigneeId', { type: () => ID }) assigneeId: string,
  ) {
    return this.tasksService.findByAssignee(assigneeId);
  }

  @Mutation(() => Task)
  async createTask(
    @Args('input') input: CreateTaskInput,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.create(
      {
        ...input,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      },
      user.id,
    );
  }

  @Mutation(() => Task)
  async updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTaskInput,
  ) {
    return this.tasksService.update(id, {
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    });
  }

  @Mutation(() => Task)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async deleteTask(@Args('id', { type: () => ID }) id: string) {
    return this.tasksService.remove(id);
  }
}
