import {defineStore} from 'pinia';
import {ICredentials, IRegister} from "@/types/security.types.ts";
import authService from "@/services/authService.ts";


export const useUserStore = defineStore('user', {
    state() {
        return {
            loader: false,
            token: '',
            isAuth: false,
            user: {},
        };
    },
    getters: {
        //TODO: gerer les bons getters
        isAuthenticated(): boolean {
            return !!this.isAuth;
        },
        isAdmin(): boolean {
            return true;
        },
        isAssociationManager(): boolean {
            return true;
        },
        fullName(): string {
            return `${this.user.first_name} ${this.user.last_name}`.trim();
        }
    },
    actions: {
        async login(credentials: ICredentials) {
            this.loader = true;
            try {
                const data = await authService.login(credentials)
                this.token = data?.access_token;
                this.user = data?.user;
                this.isAuth = true;
            } catch (e) {
                throw new Error(e.message)
            } finally {
                this.loader = false;
            }
        },
        logout() {
            // useSessionStorage('user').clear();
            this.$reset();
        },
        async refetchUser() {
            await this.login({
                email: "admin@test.com",
                password: "Password123!"
            })
        },
        async register(register: IRegister){
            this.loader = true;
            try {
                await authService.register(register)
            } catch (e) {
                throw new Error("Inscription failed")
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
                const data = await authService.login({
                    email: "admin@test.com",
                    password: "Password123!"
                })
                context.store.$state.user = data.user;
                context.store.$state.isAuth = true;
            }
        },
    }
});