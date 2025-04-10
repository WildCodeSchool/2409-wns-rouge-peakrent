import { CategoryType } from "@/types/types";
import { create } from "zustand";

export interface CategoryStoreState {
  categories: CategoryType[];
  categoriesFetched: boolean;

  setCategories: (categories: CategoryType[]) => void;
  setCategoriesFetched: (fetched: boolean) => void;

  deleteCategory: (id: number) => void;
  deleteMultipleCategories: (ids: number[]) => void;

  updateCategory: (id: number, category: Partial<CategoryType>) => void;
  addCategory: (category: CategoryType) => void;
}

export const useCategoryStore = create<CategoryStoreState>((set, get) => ({
  categories: [],
  categoriesFetched: false,

  setCategories: (categories) => set({ categories }),
  setCategoriesFetched: (fetched) => set({ categoriesFetched: fetched }),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    })),

  deleteMultipleCategories: (ids) =>
    set((state) => ({
      categories: state.categories.filter(
        (category) => !ids.includes(category.id)
      ),
    })),

  updateCategory: (id, updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updatedCategory } : category
      ),
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
}));

export const deleteCategory = (ids: (string | number)[]) => {
  const id = ids[0];
  const { deleteCategory } = useCategoryStore.getState();
  deleteCategory(id as number);
};

export const deleteMultipleCategories = (ids: (string | number)[]) => {
  const { deleteMultipleCategories } = useCategoryStore.getState();
  deleteMultipleCategories(ids as number[]);
};

export const updateCategory = (id: number, category: Partial<CategoryType>) => {
  const { updateCategory } = useCategoryStore.getState();
  updateCategory(id, category);
};

export const addCategory = (category: CategoryType) => {
  const { addCategory } = useCategoryStore.getState();
  addCategory(category);
};
