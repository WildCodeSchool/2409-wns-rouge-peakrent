import { IsNotEmpty, IsString, Length } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Profile } from "./Profile";

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: true })
  @OneToOne(() => Profile, (profile) => profile.user_id, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "profile_id" })
  @Column()
  profile_id?: Profile;

  @Field()
  @Column("varchar", { length: 255 })
  address_1!: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 255, nullable: true })
  address_2?: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 100, nullable: true })
  country!: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 100, nullable: true })
  city!: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 20, nullable: true })
  zip_code!: string;

  @Field()
  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}

@InputType()
export class CartCreateInput {
  @Field(() => Int)
  profile_id!: number;

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
export class CartUpdateInput {
  @Field(() => Int, { nullable: true })
  profile_id?: number;

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
  @Length(1, 20, { message: "zip_code must be between 1 and 20 chars." })
  zip_code?: string;
}
