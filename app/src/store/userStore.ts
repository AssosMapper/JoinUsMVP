import router from "@/router";
import authService from "@/services/authService.ts";
import usersService from "@/services/usersService.ts";
import associationService from "@/services/associationService.ts";
import { ICredentials, IRegister } from "@/types/security.types.ts";
import { LocalisationDto } from "@shared/dto/localisation.dto";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { Association } from "@shared/types/association";
import { Role } from "@shared/types/roles";
import { Expose, plainToInstance } from "class-transformer";
import { defineStore } from "pinia";

export class UserState {
  @Expose() id: string;
  @Expose() first_name: string;
  @Expose() last_name: string;
  @Expose() email: string;
  @Expose() phone?: string;
  @Expose() image?: PublicMediaDto;
  @Expose() localisation?: LocalisationDto;
  @Expose() roles: Role[];
  @Expose() associations: Association[];
  @Expose() associationId?: string;
}

export const useUserStore = defineStore("user", {
  state() {
    return {
      loader: false,
      token: "",
      isAuth: false,
      user: null as UserState | null,
      initialized: false,
    };
  },
  getters: {
    isAuthenticated(): boolean {
      return !!this.isAuth;
    },
    isAdmin(): boolean {
      return (
        this.user?.roles?.some((role: Role) => role.name === "SuperAdmin") ??
        false
      );
    },

    isAssociationManager(): boolean {
      return (
        this.user?.roles?.some(
          (role: Role) => role.name === "AssociationManager"
        ) ?? false
      );
    },
    isEventsManager(): boolean {
      return (
        this.user?.roles?.some((role: Role) => role.name === "EventsManager") ??
        false
      );
    },
    isUser(): boolean {
      return (
        this.user?.roles?.some((role: Role) => role.name === "User") ?? false
      );
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
        await this.refetchUser();
        await this.updateMyAssociations();
        this.isAuth = true;
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw new Error(e.message);
        }
        throw new Error("Une erreur est survenue");
      } finally {
        this.loader = false;
      }
    },
    getAssociation(associationId: string): Association | null {
      return (
        this.user?.associations?.find(
          (association: Association) => association.id === associationId
        ) ?? null
      );
    },
    logout() {
      this.$reset();
      this.initialized = true;
      this.loader = false;
      router.push("/login");
    },
    async refetchUser() {
      this.loader = true;
      try {
        let data = await usersService.getProfile();
        this.user = plainToInstance(UserState, data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
        await this.updateMyAssociations();
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw new Error(e.message);
        }
        throw new Error("Une erreur est survenue");
      } finally {
        this.loader = false;
      }
    },

    async updateMyAssociations(associations?: Association[]) {
      try {
        if (this.user) {
          if (associations) {
            // Utiliser les associations fournies
            this.user.associations = associations;
          } else {
            // Récupérer les associations depuis l'API
            const fetchedAssociations = await associationService.getMyAssociations();
            this.user.associations = fetchedAssociations;
          }
        }
      } catch (e: unknown) {
        console.error("Erreur lors de la mise à jour des associations:", e);
        // On ne throw pas l'erreur pour ne pas bloquer le login
      }
    },

    async register(register: IRegister) {
      this.loader = true;
      try {
        await authService.register(register);
      } catch (e: any) {
        throw e
      } finally {
        this.loader = false;
      }
    },
    setUser(userData: any) {
      this.user = userData;
    },
    async initializeStore() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
        this.isAuth = true;
      }
      this.initialized = true;
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ["token"],
    async afterRestore(context) {
      if (context.store.$state.token) {
        try {
          context.store.$state.loader = true;
          const data = await authService.getProfile(context.store.$state.token);
          context.store.$state.user = data;
          context.store.$state.isAuth = true;
          context.store.$state.initialized = true;
          await context.store.updateMyAssociations();
        } catch (error) {
          console.error("Failed to restore user session:", error);
          context.store.$state.initialized = true;
        } finally {
          context.store.$state.loader = false;
        }
      } else {
        context.store.$state.initialized = true;
      }
    },
  },
});
