import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity("stripe_webhooks")
export class StripeWebhook {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column({ unique: true })
  eventId: string;

  @Field()
  @Column()
  type: string;

  @Field(() => String)
  @Column()
  payload: string;

  @Field()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    // default: () => "CURRENT_TIMESTAMP",
  })
  received_at: Date;

  @Field({ defaultValue: false })
  @Column({ type: "boolean", default: false })
  processed: boolean;
}
