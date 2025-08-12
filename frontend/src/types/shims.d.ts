// Allow importing .vue SFCs in TS
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Loosened types for vue-unicons plugin to satisfy App.use and add()
declare module "vue-unicons" {
  const Unicon: any;
  export default Unicon;
}

// Icons module shim
declare module "vue-unicons/dist/icons" {
  export const uniTimes: any;
  export const uniCheck: any;
  export const uniTrashAlt: any;
  export const uniCircle: any;
  export const uniCheckCircle: any;
}
