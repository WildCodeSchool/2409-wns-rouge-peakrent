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
import { DateRangeInput } from "../commonInput/Date";
import { OrderItemStatusType } from "../types";
import { Cart } from "./Cart";
import { Order } from "./Order";
import { Variant } from "./Variant";

@ObjectType()
@Entity()
@Check(
  `(order_id IS NOT NULL AND cart_id IS NULL) OR (order_id IS NULL AND cart_id IS NOT NULL)`
)
export class OrderItem extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Cart, { nullable: true })
  @ManyToOne(() => Cart, (cart) => cart.id, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "cart_id" })
  cart?: Cart;

  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, (order) => order.id, { nullable: true })
  @JoinColumn({ name: "order_id" })
  order?: Order;

  @Field(() => Variant)
  @ManyToOne(() => Variant, (variant) => variant.id)
  @JoinColumn({ name: "variant_id" })
  variant!: Variant;

  @Field()
  @Column()
  quantity!: number;

  @Field(() => OrderItemStatusType, {
    defaultValue: OrderItemStatusType.pending,
  })
  @Column({
    type: "enum",
    enum: OrderItemStatusType,
    default: OrderItemStatusType.pending,
  })
  status!: OrderItemStatusType;

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
  orderId?: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "variant_id must not be empty." })
  variantId!: number;

  @Field(() => Int, { nullable: true })
  cartId?: number;

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
export class OrderItemsCreateInputAdmin extends OrderItemsCreateInput {
  @Field(() => Int)
  @IsNotEmpty({ message: "profileId must not be empty." })
  profileId!: number;
}

@InputType()
export class OrderItemsUpdateInputAdmin {
  @Field(() => Int, { nullable: true })
  orderId?: number;

  @Field(() => Int, { nullable: true })
  variantId?: number;

  @Field(() => Int, { nullable: true })
  cartId?: number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "quantity should be positive" })
  quantity?: number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "Price should be positive" })
  pricePerHour?: number;

  @Field({ nullable: true })
  @IsDate()
  startsAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  endsAt?: Date;

  @Field({ nullable: true })
  status?: OrderItemStatusType;
}

@InputType()
export class OrderItemsUpdateInput {
  @Field(() => Int, { nullable: true })
  @Min(0, { message: "quantity should be positive" })
  quantity?: number;

  @Field({ nullable: true })
  @IsDate()
  startsAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  endsAt?: Date;
}

// Input for the create order form on back office
@InputType()
export class OrderItemsFormInputAdmin {
  @Field(() => OrderItemStatusType, { nullable: true })
  status?: OrderItemStatusType;

  @Field(() => Int)
  @Min(0, { message: "Price should be positive" })
  @IsNotEmpty({ message: "pricPerHour must not be empty." })
  pricePerHour!: number;

  @Field(() => Int)
  @Min(0, { message: "Quantity should be positive" })
  @IsNotEmpty({ message: "Quantity must not be empty." })
  quantity!: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "Variant ID must not be empty." })
  variant!: number;

  @Field(() => DateRangeInput)
  date_range!: DateRangeInput;
}
