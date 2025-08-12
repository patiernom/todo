<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AddTodoInput from "@/components/AddTodoInput.vue";
import TodoItem from "@/components/TodoItem.vue";
import TodoFilters from "@/components/TodoFilters.vue";
import useTodos from "@/store/useTodos.ts";
import TodoListHeader from "@/components/TodoListHeader.vue";

const route = useRoute();

const {
  todos,
  filters,
  addTodo,
  toggleAllModel,
  removeTodo,
  deleteCompleted,
  editTodo,
  toggleTodo,
} = useTodos();

const currentFilterFromRouteName = computed(() => {
  if (route.name && typeof route.name === "string") {
    return route.name;
  }

  return "all";
});

const filteredTodos = computed(() =>
  filters[currentFilterFromRouteName.value as keyof typeof filters](),
);
</script>

<template>
  <div>
    <TodoListHeader />
    <AddTodoInput @add-todo="addTodo" />
    <main v-show="todos.length > 0" :class="$style.container">
      <label :class="$style.check" for="toggle-all-input">
        <unicon name="check-circle" fill="#05445e" v-if="toggleAllModel" />
        <unicon name="circle" fill="#05445e" v-else />
        <span>Mark All completed</span>
        <input
          type="checkbox"
          :class="$style.toggle"
          id="toggle-all-input"
          v-model="toggleAllModel"
          :disabled="filteredTodos.length === 0"
        />
      </label>
      <ul :class="$style.todos">
        <TodoItem
          v-for="(todo, index) in filteredTodos"
          :key="todo.id.toString()"
          :todo="todo"
          :index="index"
          @delete-todo="removeTodo"
          @edit-todo="editTodo"
          @toggle-todo="toggleTodo"
        />
      </ul>
      <TodoFilters @delete-completed="deleteCompleted" />
    </main>
  </div>
</template>

<style module>
.container {
  background: #ffffff;
  margin: 1rem 0;
  padding: 1rem 0.5rem;
  border-radius: 0.25rem;
}

.todos {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todos li {
  margin: 0.5rem 0;
}

.toggle {
  height: 0;
  width: 0;
  margin: 0;
  flex: 0;
}

.check {
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  justify-items: flex-end;
  gap: 1rem;
  width: 100%;
  border-bottom: 1px solid #d4f1f4;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
}

.check span {
  text-align: left;
  display: block;
  flex: 1;
  width: 100%;
}
</style>
