import {IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Length, MaxLength, Min} from "class-validator";
import {
    BaseEntity,
    Column, CreateDateColumn,
    Entity, JoinColumn,
    JoinTable,
    ManyToMany, ManyToOne, OneToMany,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";
import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Pagination} from "./Pagination";
import {IdInput} from "./Id";
import {User} from "./User";
import {Category} from "./Category";
import {Variant} from "./Variant";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({length: 100})
    @Length(1, 100, {message: "Name must be between 1 and 100 chars."})
    name!: string;

    @Field()
    @Column({length: 100})
    @Length(1, 100, {message: "Name must be between 1 and 100 chars."})
    normalizedName!: string;

    @Field({nullable: true})
    @Column({nullable: true, length: 500})
    @IsOptional()
    @MaxLength(500, {message: "Description must be at most 500 characters."})
    description?: string;

    @Field()
    @Column()
    @IsUrl()
    url_image!: string;

    @Field()
    @Column({default: false})
    is_published!: boolean;

    @Field(() => Int)
    @Column({length: 100, unique: true})
    sku!: string;

    @Field()
    @CreateDateColumn({name: "created_at"})
    created_at!: Date;

    @Field()
    @UpdateDateColumn({name: "updated_at"})
    updated_at!: Date;

    @Field(() => [Category], {nullable: true})
    @ManyToMany(() => Category, (category) => category.products)
    @JoinTable()
    categories!: Category[];

    @Field(() => [Variant], {nullable: true})
    @OneToMany(() => Variant, (variant) => variant.product, {cascade: true})
    variants!: Variant[];


    @ManyToOne(() => User)
    @JoinColumn({name: "created_by"})
    @Field(() => User)
    created_by!: User;
}

@ObjectType()
export class ProductWithCount {
    @Field(() => [Product])
    products!: Product[];

    @Field()
    pagination!: Pagination;
}

@InputType()
export class ProductCreateInput {
    @Field()
    @IsString()
    @IsNotEmpty({message: "Name is required."})
    @Length(1, 100, {message: "Name must be between 1 and 100 chars."})
    name!: string;

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(500, {message: "Description must be at most 500 chars."})
    description?: string;

    @Field()
    @IsUrl({}, {message: "URL must be a valid URL."})
    url_image!: string;

    @Field()
    @IsBoolean({message: "is_published must be a boolean value."})
    is_published!: boolean;

    @Field()
    @IsString({message: "SKU must be an string."})
    @Length(1, 100, {message: "SKU must be at most 100 chars."})
    sku!: string;

    @Field(() => [IdInput], {nullable: true})
    @IsOptional()
    categories?: IdInput[];
}

@InputType()
export class ProductUpdateInput {
    @Field()
    @IsString()
    @IsOptional()
    @IsNotEmpty({message: "Name is required."})
    @Length(1, 100, {message: "Name must be between 1 and 100 chars."})
    name?: string;

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(500, {message: "Description must be at most 500 chars."})
    description?: string;

    @Field()
    @IsOptional()
    @IsUrl({}, {message: "URL must be a valid URL."})
    url_image?: string;

    @Field()
    @IsOptional()
    @IsBoolean({message: "is_published must be a boolean value."})
    is_published?: boolean;

    @Field()
    @IsOptional()
    @IsString({message: "SKU must be an string."})
    @Length(1, 100, {message: "SKU must be at most 100 chars."})
    sku?: string;

    @Field(() => [IdInput], {nullable: true})
    @IsOptional()
    categories?: IdInput[];
}
