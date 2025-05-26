import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProjectDto {
  @Field()
  @ApiProperty({ description: 'Project name', example: 'Website Redesign' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @ApiProperty({
    description: 'Project description',
    example: 'Redesign the company website with modern UI/UX',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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
