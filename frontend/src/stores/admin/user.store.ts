import { create } from "zustand";

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStoreState {
  users: User[];
  usersFetched: boolean;

  setUsers: (users: User[]) => void;
  setUsersFetched: (fetched: boolean) => void;

  deleteUser: (id: number) => void;
  deleteMultipleUsers: (ids: number[]) => void;

  updateUser: (id: number, user: Partial<User>) => void;
  addUser: (user: User) => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  users: [],
  usersFetched: false,

  setUsers: (users) => set({ users }),
  setUsersFetched: (fetched) => set({ usersFetched: fetched }),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),

  deleteMultipleUsers: (ids) =>
    set((state) => ({
      users: state.users.filter((user) => !ids.includes(user.id)),
    })),

  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
      ),
    })),

  addUser: (newUser) =>
    set((state) => ({
      users: [...state.users, newUser],
    })),
}));

export const deleteUser = (ids: (string | number)[]) => {
  const id = ids[0];
  const { deleteUser } = useUserStore.getState();
  deleteUser(id as number);
};

export const deleteMultipleUsers = (ids: (string | number)[]) => {
  const { deleteMultipleUsers } = useUserStore.getState();
  deleteMultipleUsers(ids as number[]);
};

export const updateUser = (id: number, updatedUser: Partial<User>) => {
  const { updateUser } = useUserStore.getState();
  updateUser(id, updatedUser);
};

export const addUser = (newUser: User) => {
  const { addUser } = useUserStore.getState();
  addUser(newUser);
};
