import { IsDate, IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class DateRangeInput {
  @Field()
  @IsDate()
  @IsNotEmpty({ message: "from date must not be empty." })
  from!: Date;

  @Field()
  @IsDate()
  @IsNotEmpty({ message: "to date must not be empty." })
  to!: Date;
}
