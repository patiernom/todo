import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { userEvent, within, fn } from "storybook/test";

import TodoItem from "../components/TodoItem.vue";

type Todo = {
  id: number | string;
  title: string;
  completed: boolean;
};

const meta = {
  title: "Todo/TodoItem",
  component: TodoItem,
  tags: ["autodocs"],
  decorators: [
    () => ({
      template:
        '<div style="margin: 1rem;padding:2rem;background: white;width: 20rem;box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;border-radius: 0.375rem;"><story/></div>',
    }),
  ],
  argTypes: {
    // Show emitted events in the Actions panel
    // @ts-ignore
    "delete-todo": { action: "delete-todo" },
    "edit-todo": { action: "edit-todo" },
    "toggle-todo": { action: "toggle-todo" },
    // Controls for props
    todo: { control: "object" },
    index: { control: "number" },
  },
  args: {
    // Default handlers (also appear in actions)
    // Not strictly required when using argTypes.actions, but helpful for tests/mocks
    // @ts-ignore
    "delete-todo": fn(),
    "edit-todo": fn(),
    "toggle-todo": fn(),
  },
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseTodo: Todo = {
  id: 1,
  title: "Buy milk",
  completed: false,
};

export const Incomplete: Story = {
  name: "Incomplete",
  args: {
    todo: { ...baseTodo },
    index: 0,
  },
};

export const Completed: Story = {
  name: "Completed",
  args: {
    todo: { ...baseTodo, completed: true },
    index: 0,
  },
};

export const EditingInteraction: Story = {
  name: "Editing (via interaction)",
  args: {
    todo: { ...baseTodo },
    index: 0,
  },
  // Demonstrates entering edit mode, typing, and submitting with Enter
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Double-click the label to enter edit mode
    const titleLabel = await canvas.findByText("Buy milk");
    await userEvent.dblClick(titleLabel);
    // Type additional text and press Enter to commit edit
    const input = await canvas.findByRole("textbox");
    await userEvent.type(input, " and bread{enter}");
  },
};
