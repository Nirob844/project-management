import { Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    const { managerId, ...projectData } = dto;

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        status: dto.status || Status.ACTIVE,
        owner: {
          connect: { id: managerId },
        },
        members: {
          connect: { id: managerId },
        },
      },
      include: {
        owner: true,
        members: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });

    return project;
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        owner: true,
        members: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        members: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findByManager(managerId: string) {
    return this.prisma.project.findMany({
      where: {
        OR: [{ ownerId: managerId }, { members: { some: { id: managerId } } }],
      },
      include: {
        owner: true,
        members: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const { managerId, ...projectData } = dto;

    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(managerId && {
          owner: {
            connect: { id: managerId },
          },
          members: {
            connect: { id: managerId },
          },
        }),
      },
      include: {
        owner: true,
        members: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully' };
  }
}
