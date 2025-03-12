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
  })
  payment_method!: OrderPaymentType;

  @Field()
  @Column({ type: "timestamptz", nullable: true })
  paid_at?: Date;

  @Field()
  @Column("varchar", { length: 255 })
  address_1!: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 255, nullable: true })
  address_2?: string;

  @Field()
  @Column("varchar", { length: 100 })
  country!: string;

  @Field()
  @Column("varchar", { length: 100 })
  city!: string;

  @Field()
  @Column("varchar", { length: 20 })
  zip_code!: string;

  @Field()
  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;

  @Field()
  @ManyToOne(() => Profile, (profile) => profile.id, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "profile_id" })
  @Column()
  profile_id?: Profile;
}

@InputType()
export class OrderCreateInput {
  @Field(() => Int)
  profile_id!: number;

  @Field()
  @IsString()
  @Length(1, 100, { message: "reference must be between 1 and 255 chars." })
  reference!: string;

  @Field()
  payment_method!: OrderPaymentType;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "address_1 must not be empty." })
  @Length(1, 255, { message: "address_1 must be between 1 and 255 chars." })
  address_1!: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address_2 must be between 1 and 255 chars." })
  address_2?: string;

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
  zip_code!: string;
}

@InputType()
export class OrderUpdateInput {
  @Field(() => Int, { nullable: true })
  profile_id?: number;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 100, { message: "reference must be between 1 and 255 chars." })
  reference?: string;

  @Field({ nullable: true })
  payment_method?: OrderPaymentType;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address_1 must be between 1 and 255 chars." })
  address_1?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address_2 must be between 1 and 255 chars." })
  address_2?: string;

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
  zip_code?: string;
}

@InputType()
export class ValidateCartInput {
  @Field()
  payment_method!: OrderPaymentType;

  @Field()
  @IsString()
  @Length(1, 100, { message: "reference must be between 1 and 255 chars." })
  reference!: string;
}
