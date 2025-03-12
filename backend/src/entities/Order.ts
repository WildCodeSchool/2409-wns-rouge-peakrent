import { IsNotEmpty, IsString, Length } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
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
import { OrderPaymentType, OrderStatusType } from "../types";
import { Profile } from "./Profile";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column("varchar", { length: 100, unique: true })
  reference!: string;

  @Field(() => OrderStatusType)
  @Column({
    type: "enum",
    enum: OrderStatusType,
    default: OrderStatusType.confirmed,
  })
  status!: OrderStatusType;

  @Field(() => OrderPaymentType)
  @Column({
    type: "enum",
    enum: OrderPaymentType,
    default: OrderPaymentType.card,
    name: "payment_method",
  })
  paymentMethod!: OrderPaymentType;

  @Field()
  @Column({ name: "paid_at", type: "timestamptz", nullable: true })
  paidAt?: Date;

  @Field()
  @Column("varchar", { name: "address_1", length: 255 })
  address1!: string;

  @Field({ nullable: true })
  @Column("varchar", { name: "address_2", length: 255, nullable: true })
  address2?: string;

  @Field()
  @Column("varchar", { length: 100 })
  country!: string;

  @Field()
  @Column("varchar", { length: 100 })
  city!: string;

  @Field()
  @Column("varchar", { name: "zip_code", length: 20 })
  zipCode!: string;

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

  @Field()
  @ManyToOne(() => Profile, (profile) => profile.id, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "profile_id" })
  @Column({ name: "profile_id" })
  profileId?: Profile;
}

@InputType()
export class OrderCreateInput {
  @Field(() => Int)
  profileId!: number;

  @Field()
  @IsString()
  @Length(1, 100, { message: "reference must be between 1 and 255 chars." })
  reference!: string;

  @Field()
  paymentMethod!: OrderPaymentType;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "address_1 must not be empty." })
  @Length(1, 255, { message: "address_1 must be between 1 and 255 chars." })
  address1!: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address_2 must be between 1 and 255 chars." })
  address2?: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "country must not be empty." })
  @Length(1, 100, { message: "country must be between 1 and 100 chars." })
  country!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "city must not be empty." })
  @Length(1, 100, { message: "city must be between 1 and 100 chars." })
  city!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "zip_code must not be empty." })
  @Length(1, 20, { message: " zip_code must be between 1 and 20 chars." })
  zipCode!: string;
}

@InputType()
export class OrderUpdateInput {
  @Field(() => Int, { nullable: true })
  profileId?: number;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 100, { message: "reference must be between 1 and 255 chars." })
  reference?: string;

  @Field({ nullable: true })
  paymentMethod?: OrderPaymentType;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address_1 must be between 1 and 255 chars." })
  address1?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address_2 must be between 1 and 255 chars." })
  address2?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 100, { message: "country must be between 1 and 100 chars." })
  country?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 100, { message: "city must be between 1 and 100 chars." })
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 20, { message: " zip_code must be between 1 and 20 chars." })
  zipCode?: string;
}

@InputType()
export class ValidateCartInput {
  @Field()
  paymentMethod!: OrderPaymentType;

  @Field()
  @IsString()
  @Length(1, 100, { message: "reference must be between 1 and 255 chars." })
  reference!: string;
}
