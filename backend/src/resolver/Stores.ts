import { validate } from "class-validator";
import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { Store, StoreCreateInput, StoreUpdateInput } from "../entities/Store";

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

  @Authorized("super_admin") //TODO add super admin role
  @Mutation(() => Store)
  async createStore(
    @Arg("data", () => StoreCreateInput) data: StoreCreateInput
  ): Promise<Store> {
    const newStore = new Store();

    Object.assign(newStore, data);

    const errors = await validate(newStore);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newStore.save();
      return newStore;
    }
  }

  @Authorized("admin")
  @Mutation(() => Store)
  async updateStore(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => StoreUpdateInput) data: StoreUpdateInput
  ): Promise<Store> {
    const store = await Store.findOneBy({ id });
    if (store !== null) {
      Object.assign(store, data);

      const errors = await validate(store);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await store.save();
        return store;
      }
    } else {
      throw new Error(`Store not found`);
    }
  }

  @Authorized("admin")
  @Mutation(() => Store, { nullable: true })
  async deleteStore(@Arg("id", () => ID) id: number): Promise<Store | null> {
    const store = await Store.findOneBy({ id });
    if (store !== null) {
      await store.remove();
      return store;
    } else {
      throw new Error(`Store not found`);
    }
  }
}
