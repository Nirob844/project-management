import { Field, InputType } from '@nestjs/graphql';
import { Priority } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  parentTaskId?: string;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  priority?: Priority;

  @Field({ nullable: true })
  @IsOptional()
  dueDate?: Date;
}
