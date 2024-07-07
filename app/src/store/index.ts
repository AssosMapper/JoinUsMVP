import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import userModule from './usersStore';
import { RootState } from './types';

export default createStore<RootState>({
  plugins: [createPersistedState()],
  modules: {
    user: userModule,
  },
});