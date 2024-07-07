import { Module } from 'vuex';
import { RootState } from './types';
// import { UserRole } from '@interfaces/roles';

export enum UserRole {
    ADMIN = 'admin',
    ASSOCIATION_MANAGER = 'associationManager',
    USER = 'user'
}

export interface Role {
  id: number | null;
  name: UserRole.ADMIN | UserRole.ASSOCIATION_MANAGER | UserRole.USER;
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
  // roleId: number | null;
  role: Role | null;
}

const userModule: Module<UserState, RootState> = {
  namespaced: true,
  state: () => ({
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
    // roleId: null,
    role: null,
    }),
  getters: {
    isAuthenticated: (state) => !!state.access_token,
    isAdmin: (state) => state.role?.name === UserRole.ADMIN,
    isAssociationManager: (state) => state.role?.name === UserRole.ASSOCIATION_MANAGER,
    role: (state) => state.role,
  },
  mutations: {
    setUser(state, userData: UserState) {
      Object.assign(state, userData);
    },
    clearUser(state) {
      Object.assign(state, {
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
        // role: null,
        roleId: null,
      });
    },
  },
  actions: {
    loginUser({ commit }, userData: UserState) {
      commit('setUser', userData);
    },
    logoutUser({ commit }) {
      commit('clearUser');
    },
  },
};

export default userModule;