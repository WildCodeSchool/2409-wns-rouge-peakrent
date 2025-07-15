import { RoleType } from "@/types";
import { IsEmail, Length } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity({ name: "profile" })
export class Profile extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn({ name: "user_id" })
  id!: number;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Field()
  @Column({ length: 320, unique: true })
  @IsEmail({}, { message: "Please provide a valid email." })
  email!: string;

  @Field()
  @Column({ type: "varchar", length: 100 })
  @Length(2, 100, { message: "First name must be between 2 and 100 chars." })
  firstname!: string;

  @Field()
  @Column({ type: "varchar", length: 100 })
  @Length(2, 100, { message: "Last name must be between 2 and 100 chars." })
  lastname!: string;

  @Field()
  @Column({
    type: "enum",
    enum: RoleType,
    default: RoleType.user,
  })
  role!: RoleType;

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
}
