import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Project } from '../graphql/entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectsService } from './projects.service';

@Resolver(() => Project)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => [Project])
  async projects() {
    return this.projectsService.findAll();
  }

  @Query(() => Project)
  async project(@Args('id', { type: () => ID }) id: string) {
    return this.projectsService.findOne(id);
  }

  @Query(() => [Project])
  async myProjects(@CurrentUser() user: any) {
    return this.projectsService.findByUser(user.id);
  }

  @Mutation(() => Project)
  async createProject(
    @Args('input') input: CreateProjectInput,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.create(input, user.id);
  }

  @Mutation(() => Project)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async updateProject(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProjectInput,
  ) {
    return this.projectsService.update(id, input);
  }

  @Mutation(() => Project)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async deleteProject(@Args('id', { type: () => ID }) id: string) {
    return this.projectsService.remove(id);
  }

  @Mutation(() => Project)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async addProjectMember(
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('userId', { type: () => ID }) userId: string,
  ) {
    return this.projectsService.addMember(projectId, userId);
  }

  @Mutation(() => Project)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async removeProjectMember(
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('userId', { type: () => ID }) userId: string,
  ) {
    return this.projectsService.removeMember(projectId, userId);
  }
}
