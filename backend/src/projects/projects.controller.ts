import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const input = {
      ...createProjectDto,
      startDate: createProjectDto.startDate
        ? new Date(createProjectDto.startDate)
        : undefined,
      endDate: createProjectDto.endDate
        ? new Date(createProjectDto.endDate)
        : undefined,
    };
    return this.projectsService.create(input, req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('my-projects')
  findMyProjects(@Request() req) {
    return this.projectsService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const project = await this.projectsService.findOne(id);
    if (
      project.ownerId !== req.user.id &&
      !project.members.some((member) => member.id === req.user.id)
    ) {
      throw new ForbiddenException('You do not have access to this project');
    }
    return project;
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    const project = await this.projectsService.findOne(id);
    if (project.ownerId !== req.user.id && req.user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Only project owner or admin can update the project',
      );
    }

    const input = {
      ...updateProjectDto,
      startDate: updateProjectDto.startDate
        ? new Date(updateProjectDto.startDate)
        : undefined,
      endDate: updateProjectDto.endDate
        ? new Date(updateProjectDto.endDate)
        : undefined,
    };
    return this.projectsService.update(id, input);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    const project = await this.projectsService.findOne(id);
    if (project.ownerId !== req.user.id && req.user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Only project owner or admin can delete the project',
      );
    }
    return this.projectsService.remove(id);
  }

  @Post(':id/members/:userId')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async addMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    const project = await this.projectsService.findOne(id);
    if (project.ownerId !== req.user.id && req.user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Only project owner or admin can add members',
      );
    }
    return this.projectsService.addMember(id, userId);
  }

  @Delete(':id/members/:userId')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    const project = await this.projectsService.findOne(id);
    if (project.ownerId !== req.user.id && req.user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Only project owner or admin can remove members',
      );
    }
    return this.projectsService.removeMember(id, userId);
  }
}
