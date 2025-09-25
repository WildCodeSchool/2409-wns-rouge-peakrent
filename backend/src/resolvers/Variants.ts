import { Variant } from "@/entities/Variant";
import { Arg, ID, Query, Resolver } from "type-graphql";

@Resolver(Variant)
export class VariantResolver {
  @Query(() => [Variant])
  async getVariants(): Promise<Variant[]> {
    return await Variant.find({
      relations: { product: true, createdBy: true },
    });
  }

  @Query(() => Variant, { nullable: true })
  async getVariantById(
    @Arg("id", () => ID) id: number
  ): Promise<Variant | null> {
    return await Variant.findOne({
      where: { id },
      relations: { product: true, createdBy: true },
    });
  }
}
