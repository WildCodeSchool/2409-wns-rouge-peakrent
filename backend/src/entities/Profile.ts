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
  @PrimaryColumn()
  user_id!: number;

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
  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updated_at?: Date;
}
