import { StoreType } from "@/types/types";
import { create } from "zustand";

export interface StoreStoreState {
  stores: StoreType[];
  storesFetched: boolean;

  setStores: (stores: StoreType[]) => void;
  setStoresFetched: (fetched: boolean) => void;

  deleteStore: (id: number) => void;
  deleteMultipleStores: (ids: number[]) => void;

  updateStore: (id: number, store: Partial<StoreType>) => void;
  addStore: (newStore: StoreType) => void;
}

export const useStoreStore = create<StoreStoreState>((set, get) => ({
  stores: [],
  storesFetched: false,
  setStores: (stores) => set({ stores }),
  setStoresFetched: (fetched) => set({ storesFetched: fetched }),

  deleteStore: (id) =>
    set((state) => ({
      stores: state.stores.filter((store) => store.id !== id),
    })),

  deleteMultipleStores: (ids) =>
    set((state) => ({
      stores: state.stores.filter((store) => !ids.includes(store.id)),
    })),

  updateStore: (id, updatedStore) =>
    set((state) => ({
      stores: state.stores.map((store) =>
        store.id === id ? { ...store, ...updatedStore } : store
      ),
    })),

  addStore: (newStore) =>
    set((state) => ({
      stores: [...state.stores, newStore],
    })),
}));

export const deleteStore = (ids: (string | number)[]) => {
  const id = ids[0];
  const { deleteStore } = useStoreStore.getState();
  deleteStore(id as number);
};

export const deleteMultipleStores = (ids: (string | number)[]) => {
  const { deleteMultipleStores } = useStoreStore.getState();
  deleteMultipleStores(ids as number[]);
};

export const updateStore = (id: number, store: Partial<StoreType>) => {
  const { updateStore } = useStoreStore.getState();
  updateStore(id, store);
};

export const addStore = (newStore: StoreType) => {
  const { addStore } = useStoreStore.getState();
  addStore(newStore);
};
