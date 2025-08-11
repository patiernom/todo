<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";
import type { Todo } from "@/store/useTodos.ts";

defineProps({
  todos: { type: Array<Todo>, required: true },
  remaining: Number,
});

const route = useRoute();
</script>

<template>
  <div :class="$style.controls" v-show="todos.length > 0">
    <span>
      <strong>{{ remaining }}</strong>
      {{ remaining === 1 ? "item" : "items" }} left
    </span>
    <ul :class="$style.filters">
      <li>
        <RouterLink to="/" :class="{ selected: route.name == 'all' }">
          All
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/active" :class="{ selected: route.name == 'active' }">
          Active
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/completed"
          :class="{ selected: route.name == 'completed' }"
        >
          Completed
        </RouterLink>
      </li>
    </ul>
    <div>
      <button
        class="clear-completed"
        v-show="todos.some((todo) => todo.completed)"
        @click="$emit('delete-completed')"
      >
        Clear Completed
      </button>
    </div>
  </div>
</template>

<style module>
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  justify-items: center;
  border-top: 1px solid #d4f1f4;
  margin-top: 1rem;
  padding-top: 0.5rem;
}

.filters {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
}
</style>
