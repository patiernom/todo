import type { Meta, StoryObj } from "@storybook/vue3-vite";
import TodoList from "../components/TodoList.vue";
import router from "./mocks/router";
import { setMockTodos } from "./mocks/useTodos.mock";

type StoryMeta = Meta<typeof TodoList>;

const meta: StoryMeta = {
  title: "Todo/TodoList",
  component: TodoList,
  tags: ["autodocs"],
  decorators: [
    (story, ctx) => {
      const { mockTodos = [], routeName = "all" } = (ctx.parameters || {}) as {
        mockTodos?: Array<{
          id: number | string;
          title: string;
          completed: boolean;
        }>;
        routeName?: string;
      };
      setMockTodos(mockTodos);
      router.push({ name: routeName });
      return { components: { story }, template: "<story />" };
    },
  ],
  parameters: {
    routeName: "all",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTodos = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Read a book", completed: true },
  { id: 3, title: "Walk the dog", completed: false },
];

export const All: Story = {
  name: "All",
  parameters: {
    mockTodos: sampleTodos,
    routeName: "all",
  },
};

export const Active: Story = {
  name: "Active",
  parameters: {
    mockTodos: sampleTodos,
    routeName: "active",
  },
};

export const Completed: Story = {
  name: "Completed",
  parameters: {
    mockTodos: sampleTodos,
    routeName: "completed",
  },
};

export const Empty: Story = {
  name: "Empty",
  parameters: {
    mockTodos: [],
    routeName: "all",
  },
};
