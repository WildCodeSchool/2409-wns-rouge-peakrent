import { Store } from "@/entities/Store";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver(Store)
export class StoreResolver {
  @Query(() => [Store])
  async getStores(): Promise<Store[]> {
    return Store.find();
  }

  @Query(() => Store, { nullable: true })
  async getStoreById(
    @Arg("param", () => String) param: string
  ): Promise<Store | null> {
    const isId = !isNaN(Number(param));
    const whereCondition = isId ? { id: Number(param) } : { name: param };
    return Store.findOne({
      where: whereCondition,
    });
  }
}
