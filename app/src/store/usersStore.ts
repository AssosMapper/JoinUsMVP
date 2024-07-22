import { defineStore } from 'pinia';
import axios from 'axios';
import userService from '@/services/usersService';
import { jwtDecode } from "jwt-decode";
import { Association } from '@joinus/interfaces';

export enum UserRole {
  ADMIN = 'SuperAdmin',
  ASSOCIATION_MANAGER = 'AssociationManager',
  USER = 'User'
}

export interface Role {
  id: string;
  name: UserRole;
  description: string | null;
}

export interface UserState {
  id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  access_token: string;
  createdAt: string;
  updatedAt: string;
  phone: string | null;
  localisation: string | null;
  image: string | null;
  roles: Role[];
  association: Association | null; 
}

const initialState: UserState = {
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  access_token: '',
  createdAt: '',
  updatedAt: '',
  phone: null,
  localisation: null,
  image: null,
  roles: [],
  association: null,
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({ ...initialState }),
  getters: {
    isAuthenticated: (state): boolean => !!state.access_token,
    isAdmin: (state): boolean => state.roles.some(role => role.name === UserRole.ADMIN),
    isAssociationManager: (state): boolean => state.roles.some(role => role.name === UserRole.ASSOCIATION_MANAGER),
    fullName: (state): string => `${state.first_name} ${state.last_name}`.trim(),
  },
  actions: {
    setUser(userData: Partial<UserState>): void {
      Object.assign(this, userData);
    },
    clearUser(): void {
      Object.assign(this, initialState);
    },
    loginUser(loginResponse: { access_token: string, user: Partial<UserState> }): void {
      const { access_token, user } = loginResponse;
      this.setUser({ ...user, access_token });
    },
    logoutUser(): void {
      this.clearUser();
    },
    updateUserInfo(userData: Partial<UserState>): void {
      this.setUser(userData);
    },
    async fetchUserDetails(): Promise<void> {
      if (this.access_token) {
        try {
          const decodedToken: any = jwtDecode(this.access_token);
          const userId = decodedToken.sub;

          const response = await userService.getUserById(userId, this.access_token);
          this.setUser(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
          this.logoutUser();
        }
      }
    },
    async checkTokenValidity(): Promise<void> {
      if (this.access_token) {
        try {
          console.log('Checking token validity');
          const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/auth/check-token`, {
            headers: {
              Authorization: `Bearer ${this.access_token}`
            }
          });
          if (response.data.valid) {
            console.log('Token is valid, fetching user details');
            await this.fetchUserDetails();
          } else {
            this.logoutUser();
          }
        } catch (error) {
          console.error('Error checking token validity:', error);
          this.logoutUser();
        }
      }
    },
  },
  persist: {
    paths: ['access_token']
  }
});