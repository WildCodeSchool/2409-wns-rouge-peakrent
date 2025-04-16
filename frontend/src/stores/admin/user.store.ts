import { Profile } from "@/gql/graphql";
import { create } from "zustand";

export interface UserStoreState {
  users: Profile[];
  usersFetched: boolean;

  setUsers: (users: Profile[]) => void;
  setUsersFetched: (fetched: boolean) => void;

  deleteUser: (id: number) => void;
  deleteMultipleUsers: (ids: number[]) => void;

  updateUser: (id: number, user: Partial<Profile>) => void;
  addUser: (user: Profile) => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  users: [],
  usersFetched: false,

  setUsers: (users) => set({ users }),
  setUsersFetched: (fetched) => set({ usersFetched: fetched }),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => Number(user.id) !== id),
    })),

  deleteMultipleUsers: (ids) =>
    set((state) => ({
      users: state.users.filter((user) => !ids.includes(Number(user.id))),
    })),

  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) =>
        Number(user.id) === id ? { ...user, ...updatedUser } : user
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

export const updateUser = (id: number, updatedUser: Partial<Profile>) => {
  const { updateUser } = useUserStore.getState();
  updateUser(id, updatedUser);
};

export const addUser = (newUser: Profile) => {
  const { addUser } = useUserStore.getState();
  addUser(newUser);
};
