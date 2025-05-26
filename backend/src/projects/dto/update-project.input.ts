import { Field, InputType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  status?: Status;

  @Field({ nullable: true })
  @IsOptional()
  progress?: number;
}
