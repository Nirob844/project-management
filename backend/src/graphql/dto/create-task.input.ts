import { Field, InputType } from '@nestjs/graphql';
import { Priority, Status } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

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
