import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from "class-validator";
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
  Int,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

export enum VoucherType {
  percentage = "percentage",
  fixed = "fixed",
}
registerEnumType(VoucherType, { name: "VoucherType" });

@ObjectType()
@Entity()
export class Voucher extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Index({ unique: true })
  @Column("varchar", { length: 64, unique: true })
  code!: string;

  @Field(() => VoucherType)
  @Column({ type: "enum", enum: VoucherType })
  type!: VoucherType;

  /**
   * If type = percentage → 1..100
   * If type = fixed → integer amount in cents (or your “number” convention)
   */
  @Field(() => Int)
  @Column("int")
  @Min(1)
  amount!: number;

  @Field({ nullable: true })
  @Column("timestamptz", { nullable: true })
  startsAt?: Date;

  @Field({ nullable: true })
  @Column("timestamptz", { nullable: true })
  endsAt?: Date;

  @Field()
  @Column("boolean", { default: true })
  isActive!: boolean;

  @Field()
  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;
}

@InputType()
export class VoucherCreateInput {
  @Field()
  @IsString()
  @Length(2, 64)
  code!: string;

  @Field(() => VoucherType)
  @IsEnum(VoucherType)
  type!: VoucherType;

  @Field(() => Int)
  @IsInt()
  amount!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  startsAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  endsAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class VoucherUpdateInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 64)
  code?: string;

  @Field(() => VoucherType, { nullable: true })
  @IsOptional()
  @IsEnum(VoucherType)
  type?: VoucherType;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  startsAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  endsAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  isActive?: boolean;
}
