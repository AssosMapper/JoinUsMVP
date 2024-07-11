import { createPinia } from 'pinia';

import { useUserStore } from '../store/usersStore';

const pinia = createPinia();

export {
  pinia,
  useUserStore,
};

export function useStores() {
  return {
    userStore: useUserStore(),
  };
}