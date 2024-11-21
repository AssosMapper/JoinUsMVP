declare module "primevue/tabview" {
  import { DefineComponent } from "vue";
  const TabView: DefineComponent<{
    activeIndex?: number;
    "onUpdate:activeIndex"?: (value: number) => void;
  }>;
  export { TabView };
}

declare module "primevue/tabpanel" {
  import { DefineComponent } from "vue";
  const TabPanel: DefineComponent<{
    header: string;
    value: number;
  }>;
  export { TabPanel };
}
