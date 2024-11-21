import type { User } from "@shared/types/user";
import { defineStore } from "pinia";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) =>
      state.user?.roles.some((role) => role.name === "SuperAdmin"),
    isAssociationManager: (state) =>
      state.user?.roles.some((role) => role.name === "AssociationManager"),
    isEventsManager: (state) =>
      state.user?.roles.some((role) => role.name === "EventsManager"),
  },
});
