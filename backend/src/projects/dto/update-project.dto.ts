import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateProjectDto {
  @Field({ nullable: true })
  @ApiProperty({
    description: 'Project name',
    example: 'Website Redesign v2',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @ApiProperty({
    description: 'Project description',
    example: 'Updated project description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    description: 'Project status',
    example: 'IN_PROGRESS',
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
