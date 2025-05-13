import { Activity as ActivityType } from "@/gql/graphql";
import { create } from "zustand";

export interface ActivityStoreState {
  activities: ActivityType[];
  activitiesFetched: boolean;

  setActivities: (activities: ActivityType[]) => void;
  setActivitiesFetched: (fetched: boolean) => void;

  deleteActivity: (id: number) => void;
  deleteMultipleActivities: (ids: number[]) => void;

  updateActivity: (id: number, activity: Partial<ActivityType>) => void;
  addActivity: (activity: ActivityType) => void;
}

export const useActivityStore = create<ActivityStoreState>((set, get) => ({
  activities: [],
  activitiesFetched: false,

  setActivities: (activities) => set({ activities }),
  setActivitiesFetched: (fetched) => set({ activitiesFetched: fetched }),

  deleteActivity: (id) =>
    set((state) => ({
      activities: state.activities.filter(
        (activity) => Number(activity.id) !== id
      ),
    })),

  deleteMultipleActivities: (ids) =>
    set((state) => ({
      activities: state.activities.filter(
        (activity) => !ids.includes(Number(activity.id))
      ),
    })),

  updateActivity: (id, updatedActivity) =>
    set((state) => ({
      activities: state.activities.map((activity) =>
        Number(activity.id) === id
          ? { ...activity, ...updatedActivity }
          : activity
      ),
    })),

  addActivity: (activity) =>
    set((state) => ({
      activities: [...state.activities, activity],
    })),
}));

export const deleteActivity = (id: number) => {
  const { deleteActivity } = useActivityStore.getState();
  deleteActivity(id);
};

export const deleteMultipleActivities = (ids: number[]) => {
  const { deleteMultipleActivities } = useActivityStore.getState();
  deleteMultipleActivities(ids);
};

export const updateActivity = (id: number, activity: Partial<ActivityType>) => {
  const { updateActivity } = useActivityStore.getState();
  updateActivity(id, activity);
};

export const addActivity = (activity: ActivityType) => {
  const { addActivity } = useActivityStore.getState();
  addActivity(activity);
};
