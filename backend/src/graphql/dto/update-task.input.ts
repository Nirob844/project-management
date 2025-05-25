import { Field, InputType } from '@nestjs/graphql';
import { Priority, Status } from '@prisma/client';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  parentTaskId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  status?: Status;

  @Field(() => String, { nullable: true })
  @IsOptional()
  priority?: Priority;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  dueDate?: Date;
}
