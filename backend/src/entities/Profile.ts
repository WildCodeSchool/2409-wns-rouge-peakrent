import { IsEmail } from "class-validator";
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
import { RoleType } from "../types";
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
  @Column({ type: "varchar", length: 320, unique: true })
  @IsEmail()
  email!: string;

  @Field()
  @Column({ type: "varchar", length: 100 })
  firstname!: string;

  @Field()
  @Column({ type: "varchar", length: 100 })
  lastname!: string;

  @Field()
  @Column({
    type: "enum",
    enum: RoleType,
    default: RoleType.USER,
  })
  role!: RoleType;

  @Field()
  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true })
  updatedAt?: Date;
}
