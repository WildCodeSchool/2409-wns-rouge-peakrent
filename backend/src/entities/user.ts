import { IsEmail, IsHash, IsStrongPassword } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100, unique: true })
  @IsEmail()
  email: string;

  // @Field()
  @Column()
  hashedPassword: string;

  // @Field()
  // @Column({ default: "user" })
  // role!: Role;
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
}
