import {
  Store,
  StoreCreateInputAdmin,
  StoreUpdateInputAdmin,
} from "@/entities/Store";
import { validate } from "class-validator";
import { Arg, Authorized, ID, Mutation, Resolver } from "type-graphql";

@Resolver(Store)
export class StoreResolverAdmin {
  @Authorized("super_admin") //TODO add super admin role
  @Mutation(() => Store)
  async createStoreAdmin(
    @Arg("data", () => StoreCreateInputAdmin) data: StoreCreateInputAdmin
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
    @Arg("data", () => StoreUpdateInputAdmin) data: StoreUpdateInputAdmin
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
