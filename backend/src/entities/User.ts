import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RoleType } from "../types";
import { Profile } from "./Profile";

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
  @Column({ type: "timestamptz", nullable: true })
  email_verified_at?: Date;

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
  @Column({ type: "timestamptz", nullable: true })
  email_sent_at?: Date;

  @Field({ nullable: true })
  @Column({ type: "varchar", length: 255, nullable: true })
  recover_token?: string;

  @Field({ nullable: true })
  @Column({ type: "timestamptz", nullable: true })
  recover_sent_at?: Date;

  @Field({ nullable: true })
  @Column({ type: "varchar", length: 255, nullable: true })
  email_token?: string;

  @Field()
  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updated_at?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deleted_at?: Date;

  @AfterInsert()
  private async createProfile() {
    const profile = new Profile();
    profile.email = this.email;
    profile.firstname = this.firstname;
    profile.lastname = this.lastname;
    profile.user_id = this.id;
    profile.role = this.role;
    await profile.save();
  }
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
