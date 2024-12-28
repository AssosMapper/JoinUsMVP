import authService from "@/services/authService.ts";
import { ICredentials, IRegister } from "@/types/security.types.ts";
import { Association } from "@shared/types/association";
import { Role } from "@shared/types/roles";
import { defineStore } from "pinia";

interface UserState {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: Role[];
  associations: Association[];
  associationId?: string;
}

export const useUserStore = defineStore("user", {
  state() {
    return {
      loader: false,
      token: "",
      isAuth: false,
      user: null as UserState | null,
    };
  },
  getters: {
    isAuthenticated(): boolean {
      return !!this.isAuth;
    },
    isAdmin(): boolean {
      return (
        this.user?.roles?.some((role) => role.name === "SuperAdmin") ?? false
      );
    },

    isAssociationManager(): boolean {
      return (
        this.user?.roles?.some((role) => role.name === "AssociationManager") ??
        false
      );
    },
    isEventsManager(): boolean {
      return (
        this.user?.roles?.some((role) => role.name === "EventsManager") ?? false
      );
    },
    isUser(): boolean {
      return this.user?.roles?.some((role) => role.name === "User") ?? false;
    },
    fullName(): string {
      return `${this.user?.first_name} ${this.user?.last_name}`.trim();
    },
    associationId: (state) => state.user?.associationId,
  },
  actions: {
    async login(credentials: ICredentials) {
      this.loader = true;
      try {
        const data = await authService.login(credentials);
        this.token = data?.access_token;
        this.user = data?.user;
        this.isAuth = true;
      } catch (e) {
        throw new Error(e.message);
      } finally {
        this.loader = false;
      }
    },
    getAssociation(associationId: string): Association | null {
      return (
        this.user?.associations?.find(
          (association) => association.id === associationId
        ) ?? null
      );
    },
    logout() {
      this.$reset();
    },
    async refetchUser() {
      this.loader = true;
      try {
        const data = await authService.getProfile(this.token);
        this.user = data;
      } catch (e) {
        throw new Error(e.message);
      } finally {
        this.loader = false;
      }
    },

    async register(register: IRegister) {
      this.loader = true;
      try {
        await authService.register(register);
      } catch (e) {
        throw new Error("Inscription failed");
      } finally {
        this.loader = false;
      }
    },
    setUser(userData: any) {
      this.user = userData;
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ["token"],
    async afterRestore(context) {
      if (context.store.$state.token) {
        const data = await authService.getProfile(context.store.$state.token);
        context.store.$state.user = data;
        context.store.$state.isAuth = true;
      }
    },
  },
});
