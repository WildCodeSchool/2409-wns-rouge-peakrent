import { IsOptional, Length } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./Order";
import { StoreVariant } from "./StoreVariant";

@ObjectType()
@Entity()
export class Store extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 255 })
  @Length(1, 255, { message: "Name must be between 1 and 255 chars." })
  name!: string;

  @Field()
  @Column({ name: "phone_number", length: 20 })
  @Length(1, 20, { message: "Phone number must be between 1 and 100 chars." })
  phoneNumber!: string;

  @Field()
  @Column({ name: "address_1", length: 255 })
  @Length(1, 255, { message: "Address must be between 1 and 255 chars." })
  address1!: string;

  @Field({ nullable: true })
  @Column({ name: "address_2", length: 255, nullable: true })
  @IsOptional()
  @Length(0, 255, { message: "Address must be between 0 and 255 chars." })
  address2?: string;

  @Field()
  @Column({ length: 100 })
  @Length(1, 100, { message: "City must be between 1 and 100 chars." })
  city!: string;

  @Field()
  @Column({ name: "zip_code", length: 20 })
  @Length(1, 20, { message: "Zip code must be between 1 and 20 chars." })
  zipCode!: string;

  @Field()
  @Column({ length: 100 })
  @Length(1, 100, { message: "Country must be between 1 and 100 chars." })
  country!: string;

  @Field()
  @Column({ length: 100, unique: true })
  @Length(1, 100, { message: "Reference must be between 1 and 100 chars." })
  reference!: string;

  @Field()
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => StoreVariant, (storeVariant) => storeVariant.store)
  storeVariants!: StoreVariant[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.store)
  order!: Order[];
}

@InputType()
export class StoreCreateInput {
  @Field()
  @Length(1, 255, { message: "Name must be between 1 and 255 characters." })
  name!: string;

  @Field()
  @Length(1, 20, {
    message: "Phone number must be between 1 and 20 characters.",
  })
  phoneNumber!: string;

  @Field()
  @Length(1, 255, { message: "Address must be between 1 and 255 characters." })
  address1!: string;

  @Field({ nullable: true })
  @Length(0, 255, { message: "Address must be between 0 and 255 characters." })
  address2?: string;

  @Field()
  @Length(1, 100, { message: "City must be between 1 and 100 characters." })
  city!: string;

  @Field()
  @Length(1, 20, { message: "Zip code must be between 1 and 20 characters." })
  zipCode!: string;

  @Field()
  @Length(1, 100, { message: "Country must be between 1 and 100 characters." })
  country!: string;

  @Field()
  @Length(1, 100, {
    message: "Reference must be between 1 and 100 characters.",
  })
  reference!: string;
}

@InputType()
export class StoreUpdateInput {
  @Field(() => Int)
  id!: number;

  @Field()
  @IsOptional()
  @Length(1, 255, { message: "Name must be between 1 and 255 characters." })
  name?: string;

  @Field()
  @IsOptional()
  @Length(1, 20, {
    message: "Phone number must be between 1 and 20 characters.",
  })
  phoneNumber?: string;

  @Field()
  @IsOptional()
  @Length(1, 255, { message: "Address must be between 1 and 255 characters." })
  address1?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 255, { message: "Address must be between 0 and 255 characters." })
  address2?: string;

  @Field()
  @IsOptional()
  @Length(1, 100, { message: "City must be between 1 and 100 characters." })
  city?: string;

  @Field()
  @IsOptional()
  @Length(1, 20, { message: "Zip code must be between 1 and 20 characters." })
  zipCode?: string;

  @Field()
  @IsOptional()
  @Length(1, 100, { message: "Country must be between 1 and 100 characters." })
  country?: string;

  @Field()
  @IsOptional()
  @Length(1, 100, {
    message: "Reference must be between 1 and 100 characters.",
  })
  reference?: string;
}
