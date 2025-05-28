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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @ApiOperation({
    summary: 'Create a new project (Admin/Project Manager only)',
  })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('my-projects')
  findMyProjects(@Request() req) {
    return this.projectsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Return project details' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Update project (Admin/Project Manager only)' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
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
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project (Admin only)' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
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
