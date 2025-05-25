import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType, Project, Status, Task } from '@prisma/client';
import { CacheService } from '../cache/cache.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Injectable()
export class ProjectsService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_KEYS = {
    PROJECT: 'project:',
    PROJECTS: 'projects',
    USER_PROJECTS: 'user:projects:',
  };

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private notificationsService: NotificationsService,
  ) {}

  async create(input: CreateProjectInput, ownerId: string) {
    const project = await this.prisma.project.create({
      data: {
        ...input,
        ownerId,
        members: {
          connect: { id: ownerId },
        },
      },
      include: {
        owner: true,
        members: true,
        tasks: true,
      },
    });

    await this.invalidateCache();
    return project;
  }

  async findAll() {
    const cacheKey = this.CACHE_KEYS.PROJECTS;
    const cachedProjects = (await this.cacheService.get(cacheKey)) as
      | string
      | null;

    if (cachedProjects) {
      return JSON.parse(cachedProjects);
    }

    const projects = await this.prisma.project.findMany({
      include: {
        owner: true,
        members: true,
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(projects),
      this.CACHE_TTL,
    );
    return projects;
  }

  async findOne(id: string) {
    const cacheKey = this.CACHE_KEYS.PROJECT + id;
    const cachedProject = (await this.cacheService.get(cacheKey)) as
      | string
      | null;

    if (cachedProject) {
      return JSON.parse(cachedProject);
    }

    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        members: true,
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(project),
      this.CACHE_TTL,
    );
    return project;
  }

  async findByUser(userId: string) {
    const cacheKey = this.CACHE_KEYS.USER_PROJECTS + userId;
    const cachedProjects = (await this.cacheService.get(cacheKey)) as
      | string
      | null;

    if (cachedProjects) {
      return JSON.parse(cachedProjects);
    }

    const projects = await this.prisma.project.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
      include: {
        owner: true,
        members: true,
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(projects),
      this.CACHE_TTL,
    );
    return projects;
  }

  async update(id: string, input: UpdateProjectInput) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        tasks: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: {
        ...input,
        progress: input.progress ?? this.calculateProgress(project.tasks),
      },
      include: {
        owner: true,
        members: true,
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
    });

    await this.notifyProjectUpdate(updatedProject);
    await this.invalidateCache(id);
    return updatedProject;
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.prisma.project.delete({
      where: { id },
    });

    // Notify all members about project deletion
    for (const member of project.members) {
      await this.notificationsService.create(member.id, {
        title: 'Project Deleted',
        message: `Project "${project.name}" has been deleted`,
        type: NotificationType.SYSTEM,
        data: { projectId: id },
      });
    }

    await this.invalidateCache(id);
    return { message: 'Project deleted successfully' };
  }

  async addMember(projectId: string, userId: string) {
    const [project, user] = await Promise.all([
      this.prisma.project.findUnique({
        where: { id: projectId },
        include: { members: true },
      }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (project.members.some((member) => member.id === userId)) {
      throw new ForbiddenException('User is already a member of this project');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
      include: {
        owner: true,
        members: true,
        tasks: true,
      },
    });

    await this.notificationsService.create(userId, {
      title: 'Project Invitation',
      message: `You have been added to project: ${project.name}`,
      type: NotificationType.PROJECT_INVITATION,
      data: { projectId },
    });

    await this.invalidateCache(projectId);
    return updatedProject;
  }

  async removeMember(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (!project.members.some((member) => member.id === userId)) {
      throw new ForbiddenException('User is not a member of this project');
    }

    if (project.ownerId === userId) {
      throw new ForbiddenException('Cannot remove project owner');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
      include: {
        owner: true,
        members: true,
        tasks: true,
      },
    });

    await this.notificationsService.create(userId, {
      title: 'Project Removal',
      message: `You have been removed from project: ${project.name}`,
      type: NotificationType.PROJECT_ROLE_CHANGED,
      data: { projectId },
    });

    await this.invalidateCache(projectId);
    return updatedProject;
  }

  private calculateProgress(tasks: Task[]): number {
    if (!tasks.length) return 0;
    const completedTasks = tasks.filter(
      (task) => task.status === Status.DONE,
    ).length;
    return (completedTasks / tasks.length) * 100;
  }

  private async notifyProjectUpdate(project: Project & { members: any[] }) {
    for (const member of project.members) {
      await this.notificationsService.create(member.id, {
        title: 'Project Updated',
        message: `Project "${project.name}" has been updated`,
        type: NotificationType.SYSTEM,
        data: { projectId: project.id },
      });
    }
  }

  private async invalidateCache(projectId?: string) {
    if (projectId) {
      await this.cacheService.del(this.CACHE_KEYS.PROJECT + projectId);
    }
    await this.cacheService.del(this.CACHE_KEYS.PROJECTS);
  }
}
