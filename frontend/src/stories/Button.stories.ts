import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { fn } from "storybook/test";

import Button from "../components/Button.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Example/Button",
  component: Button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  decorators: [
    () => ({ template: '<div style="margin: 3em;"><story/></div>' }),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "secondary"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
  args: {
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  args: {
    label: "Button Default",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    label: "Button Primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    label: "Button",
  },
};

export const Large: Story = {
  args: {
    label: "Button Large",
    size: "large",
  },
};

export const Small: Story = {
  args: {
    label: "Button Small",
    size: "small",
  },
};
