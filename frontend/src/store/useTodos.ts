import { computed, ref } from "vue";

import { createTodo, deleteTodo, getTodos, updateTodo } from "@/services/todos";
import { getErrorMessage } from "@/mixins/common.ts";

export interface Todo {
  completed: Boolean;
  title: String;
  id: Number;
}
const loaded = ref(false);
const error = ref();
const todos = ref<Todo[]>([]);

const filters = {
  all: (): Todo[] => todos.value,
  active: (): Todo[] => todos.value.filter((todo) => !todo.completed),
  completed: (): Todo[] => todos.value.filter((todo) => todo.completed),
};

async function addTodo(title: String) {
  if (!title.trim()) {
    return;
  }

  const newTodo = await createTodo(title);

  todos.value.push(newTodo);
}

async function removeTodo(todo: Todo) {
  await deleteTodo(todo.id);

  todos.value = todos.value.filter((t) => t.id !== todo.id);
}

async function toggleTodo(todo: Todo, value: Boolean) {
  await updateTodo({ id: todo.id, completed: value });

  // todos.value = todos.value.map((t) => {
  //   if (t.id === todo.id) {
  //     return {
  //       ...t,
  //       completed: value,
  //     };
  //   }
  //
  //   return t;
  // });
  // here no Optimistic update just rely on the server
  await loadData();
}

async function editTodo(todo: Todo, value: String) {
  await updateTodo({ id: todo.id, title: value });

  // todos.value = todos.value.map((t) => {
  //   if (t.id === todo.id) {
  //     return {
  //       ...t,
  //       title: value,
  //     };
  //   }
  //
  //   return t;
  // });
  // here no Optimistic update just rely on the server
  await loadData();
}

async function deleteCompleted() {
  for await (const todo of todos.value.filter((todo) => todo.completed)) {
    await removeTodo(todo);
  }

  todos.value = todos.value.filter((todo) => !todo.completed);
}

async function toggleAll(value: Boolean) {
  for await (const todo of todos.value) {
    await updateTodo({ id: todo.id, completed: value });
  }

  // todos.value.forEach((todo) => {
  //   todo.completed = value;
  // });
  // here no Optimistic update just rely on the server
  await loadData();
}

async function loadData() {
  todos.value = await getTodos();
}

export default () => {
  const activeTodos = computed(() => filters.active());
  const completedTodos = computed(() => filters.completed());

  const toggleAllModel = computed({
    get() {
      return activeTodos.value.length === 0;
    },
    async set(value) {
      await toggleAll(value);
    },
  });

  (async () => {
    if (!loaded.value) {
      try {
        await loadData();
        loaded.value = true;
      } catch (e) {
        error.value = getErrorMessage(e);
        loaded.value = true;
      }
    }
  })();

  return {
    activeTodos,
    completedTodos,
    filters,
    toggleAllModel,
    loaded,
    error,
    todos: computed((): Todo[] => todos.value),
    remaining: computed(
      () => todos.value.filter((todo) => !todo.completed).length,
    ),
    addTodo,
    removeTodo,
    toggleTodo,
    editTodo,
    deleteCompleted,
  };
};
