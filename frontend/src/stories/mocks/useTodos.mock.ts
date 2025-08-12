import { ref, computed } from "vue";

export type Todo = {
  id: number | string;
  title: string;
  completed: boolean;
};

const todos = ref<Todo[]>([]);

const filters = {
  all: () => todos.value,
  active: () => todos.value.filter((t) => !t.completed),
  completed: () => todos.value.filter((t) => t.completed),
};

const toggleAllModel = computed({
  get() {
    return todos.value.length > 0 && todos.value.every((t) => t.completed);
  },
  set(value: boolean) {
    todos.value = todos.value.map((t) => ({ ...t, completed: value }));
  },
});

function addTodo(title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const id = Date.now() + Math.random();
  todos.value = [...todos.value, { id, title: trimmed, completed: false }];
}

function removeTodo(todo: Todo) {
  todos.value = todos.value.filter((t) => t.id !== todo.id);
}

function deleteCompleted() {
  todos.value = todos.value.filter((t) => !t.completed);
}

function editTodo(todo: Todo, newTitle: string) {
  const trimmed = newTitle.trim();
  todos.value = todos.value.map((t) =>
    t.id === todo.id ? { ...t, title: trimmed } : t,
  );
}

function toggleTodo(todo: Todo, value: boolean) {
  todos.value = todos.value.map((t) =>
    t.id === todo.id ? { ...t, completed: value } : t,
  );
}

// Helpers for stories to seed/reset state
export function setMockTodos(seed: Todo[]) {
  todos.value = seed.map((t) => ({ ...t }));
}

export function resetMockTodos() {
  todos.value = [];
}

const remaining = computed(
  () => todos.value.filter((t) => !t.completed).length,
);

export default function useTodos() {
  return {
    todos,
    filters,
    addTodo,
    toggleAllModel,
    removeTodo,
    deleteCompleted,
    editTodo,
    toggleTodo,
    remaining,
  };
}
