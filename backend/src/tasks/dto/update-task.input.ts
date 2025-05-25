import { Field, InputType } from '@nestjs/graphql';
import { Priority, Status } from '@prisma/client';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  status?: Status;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  priority?: Priority;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  parentTaskId?: string;

  @Field({ nullable: true })
  @IsOptional()
  dueDate?: Date;
}
