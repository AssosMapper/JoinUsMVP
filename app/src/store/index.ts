// import { createPinia } from 'pinia';
<<<<<<< HEAD
import { useUserStore } from '../store/usersStore';
=======
import { useUserStore } from "../store/userStore";
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

// const pinia = createPinia();

export {
  // pinia,
  useUserStore,
};

export function useStores() {
  return {
    userStore: useUserStore(),
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
