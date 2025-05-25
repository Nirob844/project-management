import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Query(() => User)
  async me(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @Mutation(() => User)
  @Roles(Role.ADMIN)
  async createUser(@Args('input') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    // Only allow users to update their own profile unless they're an admin
    if (user.role !== Role.ADMIN && user.id !== id) {
      throw new Error('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation(() => User)
  @Roles(Role.ADMIN)
  async removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove(id);
  }
}
