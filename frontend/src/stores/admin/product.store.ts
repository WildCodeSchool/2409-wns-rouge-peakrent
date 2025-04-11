import { Product } from "@/gql/graphql";
import { create } from "zustand";

export interface ProductStoreState {
  products: Product[];
  productsFetched: boolean;
  setStore: (store: ProductStoreState) => void;
  setProducts: (products: Product[]) => void;
  setProductsFetched: (bool: boolean) => void;
  addProduct: (newReference: Product) => void;
  deleteProduct: (id: number) => void;
  deleteMultipleProducts: (ids: number[]) => void;

  updateProduct: (id: number, product: Partial<Product>) => void;
}

// Define the store
export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  productsFetched: false,

  setProductsFetched: (bool: boolean) => set({ productsFetched: bool }),

  setProducts: (products: Product[]) => set({ products }),
  setStore: (store) => set(store),

  addProduct: (newProduct: Product) =>
    set((state) => ({
      products: [newProduct, ...state.products],
    })),

  deleteProduct: (id: number) =>
    set((state) => ({
      products: state.products.filter((product) => Number(product.id) !== id),
    })),

  deleteMultipleProducts: (ids: number[]) =>
    set((state) => ({
      products: state.products.filter(
        (product) => !ids.includes(Number(product.id))
      ),
    })),

  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        Number(product.id) === id ? { ...product, ...updatedProduct } : product
      ),
    })),
}));

export const addProduct = (newProduct: Product) => {
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

export const updateProduct = (id: number, product: Partial<Product>) => {
  const { updateProduct } = useProductStore.getState();
  updateProduct(id, product);
};
