import { createRouter, createMemoryHistory } from "vue-router";

const routes = [
  { path: "/", name: "all", component: { template: "<div />" } },
  { path: "/active", name: "active", component: { template: "<div />" } },
  { path: "/completed", name: "completed", component: { template: "<div />" } },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
