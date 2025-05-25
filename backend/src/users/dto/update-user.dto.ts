import { Field, InputType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  role?: Role;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isActive?: boolean;
}
