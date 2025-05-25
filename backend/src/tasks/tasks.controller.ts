import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  create(@Body() createTaskInput: CreateTaskInput, @Request() req) {
    return this.tasksService.create(createTaskInput, req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('my-tasks')
  async findMyTasks(@Request() req) {
    return this.tasksService.findByAssignee(req.user.id);
  }

  @Get('project/:projectId')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  findByProject(@Param('projectId') projectId: string) {
    return this.tasksService.findByProject(projectId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  update(@Param('id') id: string, @Body() updateTaskInput: UpdateTaskInput) {
    return this.tasksService.update(id, updateTaskInput);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
