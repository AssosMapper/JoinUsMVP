import { defineStore } from 'pinia';

export enum UserRole {
    ADMIN = 'admin',
    ASSOCIATION_MANAGER = 'associationManager',
    USER = 'user'
}

export interface Role {
  id: number | null;
  name: UserRole;
}

export interface UserState {
  id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  access_token: string;
  address: string;
  country: string;
  dateCreated: string;
  phone: string;
  zip: string;
  image: string | null;
  role: Role | null;
  associationId: number | null;
}

const initialState: UserState = {
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  access_token: '',
  address: '',
  country: '',
  dateCreated: '',
  phone: '',
  zip: '',
  image: null,
  role: null,
  associationId: null,
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({ ...initialState }),
  getters: {
    isAuthenticated: (state): boolean => !!state.access_token,
    isAdmin: (state): boolean => state.role?.name === UserRole.ADMIN,
    isAssociationManager: (state): boolean => state.role?.name === UserRole.ASSOCIATION_MANAGER,
    fullName: (state): string => `${state.first_name} ${state.last_name}`.trim(),
  },
  actions: {
    setUser(userData: Partial<UserState>): void {
      Object.assign(this, userData);
    },
    clearUser(): void {
      Object.assign(this, initialState);
    },
    loginUser(userData: UserState): void {
      this.setUser(userData);
    },
    logoutUser(): void {
      this.clearUser();
    },
    updateUserInfo(userData: Partial<UserState>): void {
      this.setUser(userData);
    },
  },
  persist: true
});