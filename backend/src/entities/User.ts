import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RoleType } from "../types";

@ObjectType()
@Entity({ name: "user" })
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 320, unique: true })
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @Column({ name: "email_verified_at", type: "timestamptz", nullable: true })
  emailVerifiedAt?: Date;

  @Field()
  @Column({ type: "varchar", length: 100 })
  firstname!: string;

  @Field()
  @Column({ type: "varchar", length: 100 })
  lastname!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Field()
  @Column({
    type: "enum",
    enum: RoleType,
    default: RoleType.USER,
  })
  role!: RoleType;

  @Field({ nullable: true })
  @Column({ name: "email_sent_at", type: "timestamptz", nullable: true })
  emailSentAt?: Date;

  @Field({ nullable: true })
  @Column({
    name: "recover_token",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  recoverToken?: string;

  @Field({ nullable: true })
  @Column({ name: "recover_sent_at", type: "timestamptz", nullable: true })
  recoverSentAt?: Date;

  @Field({ nullable: true })
  @Column({ name: "email_token", type: "varchar", length: 255, nullable: true })
  emailToken?: string;

  @Field()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date;
}

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsStrongPassword(
    { minLength: 10, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
    {
      message:
        "Password must be at least 10 characters long and include 1 number, 1 uppercase letter, and 1 symbol",
    }
  )
  password!: string;

  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field()
  @IsNotEmpty()
  confirmPassword!: string;
}
