import { StripePaymentStatusType } from "@/types";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./Order";
import { Profile } from "./Profile";

@ObjectType()
@Entity()
export class Payment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, nullable: true })
  stripePaymentIntentId: string;

  @Field()
  @Column({ unique: true, nullable: true })
  clientSecret: string;

  @Field()
  @Column()
  amount: number;

  @Field()
  @Column({ default: "eur" })
  currency: string;

  @Field()
  @Column({
    type: "enum",
    enum: StripePaymentStatusType,
    default: StripePaymentStatusType.RequiresPaymentMethod,
  })
  status: StripePaymentStatusType;

  @Field(() => Order)
  @ManyToOne(() => Order, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn()
  order: Order;

  @Field(() => Profile)
  @ManyToOne(() => Profile, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn()
  profile: Profile;

  @Field()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
