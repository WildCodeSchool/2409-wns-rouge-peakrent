import { Variant } from "@/entities/Variant";
import { ContextType, RoleType } from "@/types";
import { Arg, Ctx, ID, Query, Resolver } from "type-graphql";

@Resolver(Variant)
export class VariantResolver {
  @Query(() => [Variant])
  async getVariants(@Ctx() context: ContextType): Promise<Variant[]> {
    const isAdmin =
      context.user?.role === RoleType.admin ||
      context.user?.role === RoleType.superadmin;

    return await Variant.find({
      relations: { product: true, createdBy: isAdmin },
    });
  }

  @Query(() => Variant, { nullable: true })
  async getVariantById(
    @Ctx() context: ContextType,
    @Arg("id", () => ID) id: number
  ): Promise<Variant | null> {
    const isAdmin =
      context.user?.role === RoleType.admin ||
      context.user?.role === RoleType.superadmin;

    return await Variant.findOne({
      where: { id },
      relations: { product: true, createdBy: isAdmin },
    });
  }
}
