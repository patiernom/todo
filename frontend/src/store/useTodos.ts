import { computed, ref } from "vue";

import { getTodos } from "@/services/todos";
import { getErrorMessage, uuid } from "@/mixins/common.ts";

type UUID = string;

interface Todo {
  completed: Boolean;
  title: String;
  id: UUID;
}
const loaded = ref(false);
const error = ref();
const todos = ref<Todo[]>([]);

const filters = {
  all: (): Todo[] => todos.value,
  active: (): Todo[] => todos.value.filter((todo) => !todo.completed),
  completed: (): Todo[] => todos.value.filter((todo) => todo.completed),
};

export default function () {
  const activeTodos = computed(() => filters.active());
  const completedTodos = computed(() => filters.completed());

  function addTodo(value: String) {
    todos.value.push({
      completed: false,
      title: value,
      id: uuid(),
    });
  }

  function deleteTodo(todo: Todo) {
    todos.value = todos.value.filter((t) => t !== todo);
  }

  function toggleTodo(todo: Todo, value: Boolean) {
    todo.completed = value;
  }

  function editTodo(todo: Todo, value: String) {
    todo.title = value;
  }

  function deleteCompleted() {
    todos.value = todos.value.filter((todo) => !todo.completed);
  }

  const toggleAllModel = computed({
    get() {
      return activeTodos.value.length === 0;
    },
    set(value) {
      todos.value.forEach((todo) => {
        todo.completed = value;
      });
    },
  });

  (async () => {
    if (!loaded.value) {
      try {
        todos.value = await getTodos();
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
    deleteTodo,
    toggleTodo,
    editTodo,
    deleteCompleted,
  };
}
