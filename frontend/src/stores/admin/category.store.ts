import { Category } from "@/gql/graphql";
import { create } from "zustand";

export interface CategoryStoreState {
  categories: Category[];
  categoriesFetched: boolean;

  setCategories: (categories: Category[]) => void;
  setCategoriesFetched: (fetched: boolean) => void;

  deleteCategory: (id: number) => void;
  deleteMultipleCategories: (ids: number[]) => void;

  updateCategory: (id: number, category: Partial<Category>) => void;
  addCategory: (category: Category) => void;
}

export const useCategoryStore = create<CategoryStoreState>((set, get) => ({
  categories: [],
  categoriesFetched: false,

  setCategories: (categories) => set({ categories }),
  setCategoriesFetched: (fetched) => set({ categoriesFetched: fetched }),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter(
        (category) => Number(category.id) !== id
      ),
    })),

  deleteMultipleCategories: (ids) =>
    set((state) => ({
      categories: state.categories.filter(
        (category) => !ids.includes(Number(category.id))
      ),
    })),

  updateCategory: (id, updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        Number(category.id) === id
          ? { ...category, ...updatedCategory }
          : category
      ),
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
}));

export const deleteCategory = (id: number) => {
  const { deleteCategory } = useCategoryStore.getState();
  deleteCategory(id);
};

export const deleteMultipleCategories = (ids: number[]) => {
  const { deleteMultipleCategories } = useCategoryStore.getState();
  deleteMultipleCategories(ids);
};

export const updateCategory = (id: number, category: Partial<Category>) => {
  const { updateCategory } = useCategoryStore.getState();
  updateCategory(id, category);
};

export const addCategory = (category: Category) => {
  const { addCategory } = useCategoryStore.getState();
  addCategory(category);
};
