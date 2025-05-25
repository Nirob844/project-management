import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Priority, Status } from '@prisma/client';

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => String)
  projectId: string;

  @Field(() => String, { nullable: true })
  assigneeId?: string;

  @Field(() => String, { nullable: true })
  parentTaskId?: string;

  @Field(() => String)
  status: Status;

  @Field(() => String)
  priority: Priority;

  @Field(() => Date)
  dueDate: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [Task], { nullable: true })
  subtasks?: Task[];

  @Field(() => [String], { nullable: true })
  dependencies?: string[];

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
