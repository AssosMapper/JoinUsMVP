import { defineStore } from 'pinia';
import { ICredentials, IRegister } from "@/types/security.types.ts";
import authService from "@/services/authService.ts";

export const useUserStore = defineStore('user', {
    state() {
        return {
            loader: false,
            token: '',   // Stocke le token d'authentification
            isAuth: false,  // Vérifie si l'utilisateur est authentifié
            user: {       // Informations de l'utilisateur
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
                this.token = data?.access_token; // Stocke le token renvoyé après login
                this.user = data?.user;  // Stocke les infos utilisateur
                this.isAuth = true;      // Indique que l'utilisateur est authentifié

                // Ajout du console.log après le login
                console.log('État du store après login:', this.$state);
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
        logout() {
            this.$reset();  // Réinitialise le store à son état initial lors de la déconnexion
        },
        async refetchUser() {
            this.loader = true;
            try {
                const data = await authService.getProfile(this.token);
                this.user = data;  // Met à jour les informations utilisateur si le token est valide

                // Ajout du console.log après la réactualisation
                console.log('État du store après réactualisation:', this.$state);
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
    // Activation de la persistance du store
    persist: {
        storage: sessionStorage,  // Utilisation du sessionStorage pour conserver les données
        paths: ['token'],         // Persiste uniquement le token
        async afterRestore(context) {
            if (context.store.$state.token) {
                try {
                    // Si le token est restauré, récupère les infos utilisateur
                    const data = await authService.getProfile(context.store.$state.token);
                    context.store.$state.user = data;
                    context.store.$state.isAuth = true;  // Réauthentifie l'utilisateur

                    // Ajout du console.log après la restauration des données
                    console.log('État du store après restauration:', context.store.$state);
                } catch (error) {
                    console.error("Erreur lors de la restauration de l'état utilisateur :", error);
                    context.store.$reset();  // Réinitialise en cas de problème
                }
            }
        }
    }
});
