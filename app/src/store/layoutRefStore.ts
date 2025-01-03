import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutRefStore = defineStore("layoutRef", () => {
  const mainRef = ref<HTMLElement | null>(null);

  const setMainRef = (element: HTMLElement | null) => {
    mainRef.value = element;
  };

  return {
    mainRef,
    setMainRef,
  };
});
