import { create } from "zustand";

interface SidebarStore {
  isMinimized: boolean;
  isFixed: boolean;
  toggleFixed: () => void;
}

export const useAdminSidebarStore = create<SidebarStore>((set) => ({
  isMinimized: false,
  isFixed: true,
  toggleFixed: () =>
    set((state) => ({
      isFixed: !state.isFixed,
      isMinimized: !state.isMinimized,
    })),
}));
