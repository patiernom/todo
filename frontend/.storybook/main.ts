import type { StorybookConfig } from "@storybook/vue3-vite";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  // Alias the useTodos composable to a Storybook-specific mock
  async viteFinal(viteConfig) {
    const replacement = fileURLToPath(
      new URL("../src/stories/mocks/useTodos.mock.ts", import.meta.url),
    );

    const existing = viteConfig.resolve?.alias;
    let aliasArray: Array<{ find: any; replacement: any }> = [];

    if (Array.isArray(existing)) {
      aliasArray = existing;
    } else if (existing && typeof existing === "object") {
      aliasArray = Object.entries(existing).map(([find, replacement]) => ({
        find,
        replacement,
      }));
    }

    // Prepend our aliases so they resolve before the '@' alias
    aliasArray = [
      { find: "@/store/useTodos.ts", replacement },
      { find: "/src/store/useTodos.ts", replacement },
      ...aliasArray,
    ];

    viteConfig.resolve = {
      ...(viteConfig.resolve || {}),
      alias: aliasArray,
    };

    return viteConfig;
  },
};
export default config;
