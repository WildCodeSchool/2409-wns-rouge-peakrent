import { IsDate, IsNotEmpty, Min } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Order } from "./Order";
import { Variant } from "./Variant";

@ObjectType()
@Entity()
@Check(
  `(order_id IS NOT NULL AND cart_id IS NULL) OR (order_id IS NULL AND cart_id IS NOT NULL)`
)
export class OrderItems extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: true })
  @ManyToOne(() => Cart, (cart) => cart.id, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "cart_id" })
  @Column({ name: "cart_id", nullable: true })
  cart?: Cart;

  @Field({ nullable: true })
  @ManyToOne(() => Order, (order) => order.id, { nullable: true })
  @JoinColumn({ name: "order_id" })
  @Column({ name: "order_id", nullable: true })
  order?: Order;

  @Field({ nullable: true })
  @ManyToOne(() => Variant, (variant) => variant.id, { nullable: true })
  @JoinColumn({ name: "variant_id" })
  @Column({ name: "variant_id", nullable: true })
  variant?: Variant;

  @Field()
  @Column()
  quantity!: number;

  @Field()
  @Column({ name: "price_per_hour" })
  pricePerHour!: number;

  @Field()
  @Column({ name: "starts_at", type: "timestamptz" })
  startsAt!: Date;

  @Field()
  @Column({ name: "ends_at", type: "timestamptz" })
  endsAt!: Date;

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

@InputType()
export class OrderItemsCreateInput {
  @Field(() => Int, { nullable: true })
  orderId?: Number;

  @Field(() => Int)
  @IsNotEmpty({ message: "variant_id must not be empty." })
  variantId!: Number;

  @Field(() => Int, { nullable: true })
  cartId?: Number;

  @Field(() => Int)
  @Min(0, { message: "quantity should be positive" })
  @IsNotEmpty({ message: "quantity must not be empty." })
  quantity!: number;

  @Field(() => Int)
  @Min(0, { message: "Price should be positive" })
  @IsNotEmpty({ message: "price_per_hour must not be empty." })
  pricePerHour!: number;

  @Field()
  @IsDate()
  @IsNotEmpty({ message: "starts_at must not be empty." })
  startsAt!: Date;

  @Field()
  @IsDate()
  @IsNotEmpty({ message: "ends_at must not be empty." })
  endsAt!: Date;
}

@InputType()
export class OrderItemsUpdateInput {
  @Field(() => Int, { nullable: true })
  orderId?: Number;

  @Field(() => Int, { nullable: true })
  variantId?: Number;

  @Field(() => Int, { nullable: true })
  cartId?: Number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "quantity should be positive" })
  quantity: number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "Price should be positive" })
  pricePerHour?: number;

  @Field({ nullable: true })
  @IsDate()
  startsAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  endsAt?: Date;
}
