import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_KEYS = {
    USER: 'user:',
    USERS: 'users:',
  };

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    await this.invalidateCache();
    return result;
  }

  async findAll() {
    const cacheKey = this.CACHE_KEYS.USERS + 'all';
    const cachedUsers = await this.cacheService.get(cacheKey);

    if (cachedUsers && typeof cachedUsers === 'string') {
      return JSON.parse(cachedUsers);
    }

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(users),
      this.CACHE_TTL,
    );
    return users;
  }

  async findOne(id: string) {
    const cacheKey = this.CACHE_KEYS.USER + id;
    const cachedUser = await this.cacheService.get(cacheKey);

    if (cachedUser && typeof cachedUser === 'string') {
      return JSON.parse(cachedUser);
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          select: { id: true },
        },
        tasks: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = {
      ...user,
      projectIds: user.projects.map((p) => p.id),
      taskIds: user.tasks.map((t) => t.id),
    };

    await this.cacheService.set(
      cacheKey,
      JSON.stringify(result),
      this.CACHE_TTL,
    );
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.invalidateCache(id);
    return updatedUser;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateProfileDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const data: any = { ...updateProfileDto };
    if (updateProfileDto.password) {
      data.password = await bcrypt.hash(updateProfileDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.invalidateCache(id);
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
    await this.invalidateCache(id);
    return { message: 'User deleted successfully' };
  }

  private async invalidateCache(userId?: string) {
    const keys = [this.CACHE_KEYS.USERS + 'all'];
    if (userId) {
      keys.push(this.CACHE_KEYS.USER + userId);
    }
    await Promise.all(keys.map((key) => this.cacheService.del(key)));
  }
}
