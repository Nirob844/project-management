import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => String)
  role: Role;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [String], { nullable: true })
  projectIds?: string[];

  @Field(() => [String], { nullable: true })
  taskIds?: string[];
}
