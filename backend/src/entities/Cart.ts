import { IsString, Length } from "class-validator";
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
  @OneToOne(() => Profile, (profile) => profile.id, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  profile?: Profile;

  @Field({ nullable: true })
  @Column("varchar", { name: "address_1", length: 255, nullable: true })
  address1?: string;

  @Field({ nullable: true })
  @Column("varchar", { name: "address_2", length: 255, nullable: true })
  address2?: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 100, nullable: true })
  country?: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 100, nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column("varchar", { name: "zip_code", length: 20, nullable: true })
  zipCode?: string;

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
export class CartCreateInput {
  @Field(() => Int)
  profileId!: number;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address1 must be between 1 and 255 chars." })
  address1?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address2 must be between 1 and 255 chars." })
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
  @Length(1, 20, { message: "zipCode must be between 1 and 20 chars." })
  zipCode?: string;
}

@InputType()
export class CartUpdateInput {
  @Field(() => Int, { nullable: true })
  profileId?: number;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address1 must be between 1 and 255 chars." })
  address1?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(1, 255, { message: "address2 must be between 1 and 255 chars." })
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
  @Length(1, 20, { message: "zipCode must be between 1 and 20 chars." })
  zipCode?: string;
}
