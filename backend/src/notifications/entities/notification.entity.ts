import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => String)
  type: NotificationType;

  @Field()
  isRead: boolean;

  @Field()
  userId: string;

  @Field({ nullable: true })
  data?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
