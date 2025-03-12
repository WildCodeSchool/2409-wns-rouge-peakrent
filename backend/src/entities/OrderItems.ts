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
  @Column({ nullable: true })
  cart_id?: Cart;

  @Field({ nullable: true })
  @ManyToOne(() => Order, (order) => order.id, { nullable: true })
  @JoinColumn({ name: "order_id" })
  @Column({ nullable: true })
  order_id?: Order;

  @Field({ nullable: true })
  @ManyToOne(() => Variant, (variant) => variant.id, { nullable: true })
  @JoinColumn({ name: "variant_id" })
  @Column({ nullable: true })
  variant_id?: Variant;

  @Field()
  @Column()
  quantity!: number;

  @Field()
  @Column()
  price_per_hour!: number;

  @Field()
  @Column({ type: "timestamptz" })
  starts_at!: Date;

  @Field()
  @Column({ type: "timestamptz" })
  ends_at!: Date;

  @Field()
  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}

@InputType()
export class OrderItemsCreateInput {
  @Field(() => Int, { nullable: true })
  order_id?: Number;

  @Field(() => Int)
  @IsNotEmpty({ message: "variant_id must not be empty." })
  variant_id!: Number;

  @Field(() => Int, { nullable: true })
  cart_id?: Number;

  @Field(() => Int)
  @Min(0, { message: "quantity should be positive" })
  @IsNotEmpty({ message: "quantity must not be empty." })
  quantity!: number;

  @Field(() => Int)
  @Min(0, { message: "Price should be positive" })
  @IsNotEmpty({ message: "price_per_hour must not be empty." })
  price_per_hour!: number;

  @Field()
  @IsDate()
  @IsNotEmpty({ message: "starts_at must not be empty." })
  starts_at!: Date;

  @Field()
  @IsDate()
  @IsNotEmpty({ message: "ends_at must not be empty." })
  ends_at!: Date;
}

@InputType()
export class OrderItemsUpdateInput {
  @Field(() => Int, { nullable: true })
  order_id?: Number;

  @Field(() => Int, { nullable: true })
  variant_id?: Number;

  @Field(() => Int, { nullable: true })
  cart_id?: Number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "quantity should be positive" })
  quantity: number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "Price should be positive" })
  price_per_hour?: number;

  @Field({ nullable: true })
  @IsDate()
  starts_at?: Date;

  @Field({ nullable: true })
  @IsDate()
  ends_at?: Date;
}
