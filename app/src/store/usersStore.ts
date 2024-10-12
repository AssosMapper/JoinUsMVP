import { defineStore } from 'pinia';
import { ICredentials, IRegister } from "@/types/security.types.ts";
import authService from "@/services/authService.ts";

export const useUserStore = defineStore('user', {
    state() {
        return {
            loader: false,
            token: '',
            isAuth: false,
            user: {
                id: '',
                first_name: '',
                last_name: '',
                roles: [] as any[],  
                association: {
                  id: '',  
                  name: '', 
                }  
              }
              
        };
    },
    getters: {
        isAuthenticated(): boolean {
            return !!this.isAuth;
        },
        isAdmin(): boolean {
            return this.user.roles?.some(role => role.name === 'SuperAdmin') ?? false;
        },
        isAssociationManager(): boolean {
            return this.user.roles?.some(role => role.name === 'AssociationManager') ?? false;
        },
        isEventsManager(): boolean {
            return this.user.roles?.some(role => role.name === 'EventsManager') ?? false;
        },
        isUser(): boolean {
            return this.user.roles?.some(role => role.name === 'User') ?? false;
        },
        fullName(): string {
            return `${this.user.first_name} ${this.user.last_name}`.trim();
        }
    },
    actions: {
        async login(credentials: ICredentials) {
            this.loader = true;
            try {
                const data = await authService.login(credentials);
                this.token = data?.access_token;
                this.user = data?.user;
                this.isAuth = true;
            } catch (e: unknown) {
                // Vérification que l'erreur est bien de type Error
                if (e instanceof Error) {
                    throw new Error(e.message);
                } else {
                    throw new Error("Une erreur inconnue s'est produite.");
                }
            } finally {
                this.loader = false;
            }
        },
        logout() {
            this.$reset();
        },
        async refetchUser() {
            this.loader = true;
            try {
                const data = await authService.getProfile(this.token);
                this.user = data;
            } catch (e: unknown) {
                if (e instanceof Error) {
                    throw new Error(e.message);
                } else {
                    throw new Error("Une erreur inconnue s'est produite.");
                }
            } finally {
                this.loader = false;
            }
        },
        async register(register: IRegister) {
            this.loader = true;
            try {
                await authService.register(register);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    throw new Error("Inscription failed: " + e.message);
                } else {
                    throw new Error("Une erreur inconnue s'est produite.");
                }
            } finally {
                this.loader = false;
            }
        }
    },
    persist: {
        storage: sessionStorage,
        paths: ['token'],
        async afterRestore(context) {
          if (context.store.$state.token) {
            const data = await authService.getProfile(context.store.$state.token);
            context.store.$state.user = data;
            context.store.$state.isAuth = true;
          }
        },
    }
});
