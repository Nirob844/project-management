import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => String)
  status: Status;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  progress: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  owner: User;

  @Field(() => [User])
  members: User[];

  @Field(() => [Task])
  tasks: Task[];
}
