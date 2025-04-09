import { GET_PRODUCTS } from "@/GraphQL/products";
import { ProductType } from "@/types/types";
import { useQuery } from "@apollo/client";
import { toast } from "sonner";
import { create } from "zustand";

export interface ProductStoreState {
  products: ProductType[];
  productsFetched: boolean;
  setStore: (store: ProductStoreState) => void;
  setProducts: (products: ProductType[]) => void;
  setProductsFetched: (bool: boolean) => void;
  addProduct: (newReference: ProductType) => void;
  deleteProduct: (id: number) => void;
  deleteMultipleProducts: (ids: number[]) => void;
}

// Define the store
export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  productsFetched: false,

  setProductsFetched: (bool: boolean) => set({ productsFetched: bool }),

  setProducts: (products: ProductType[]) => set({ products }),
  setStore: (store) => set(store),

  addProduct: (newProduct: ProductType) =>
    set((state) => ({
      products: [newProduct, ...state.products],
    })),

  deleteProduct: (id: number) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),

  deleteMultipleProducts: (ids: number[]) =>
    set((state) => ({
      products: state.products.filter((product) => !ids.includes(product.id)),
    })),
}));

export const addProduct = (newProduct: ProductType) => {
  const { addProduct } = useProductStore.getState();
  addProduct(newProduct);
};

export const deleteProduct = (ids: (string | number)[]) => {
  const id = Number(ids[0]);
  const { deleteProduct } = useProductStore.getState();
  deleteProduct(id);
};

export const deleteMultipleProducts = (ids: (string | number)[]) => {
  const numericIds = ids.map((id) => Number(id));
  const { deleteMultipleProducts } = useProductStore.getState();
  deleteMultipleProducts(numericIds);
};
