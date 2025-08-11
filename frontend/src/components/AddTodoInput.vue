<script setup lang="ts">
import { defineEmits } from "vue";

const emits = defineEmits(["add-todo"]);

const addTodo = (title: string) => {
  if (title.trim().length > 0) {
    emits("add-todo", title.trim());
  }
};
</script>

<template>
  <div :class="$style.AddTodoInput">
    <input
      type="text"
      autofocus
      autocomplete="off"
      placeholder="What needs to be done?"
      @keyup.enter="
        // @ts-ignore
        addTodo($event.target.value);
        // @ts-ignore
        $event.target.value = '';
      "
    />
  </div>
</template>

<style module>
.AddTodoInput input {
  border: none;
  color: #05445e;
  font-size: 2rem;
  padding: 1rem 2rem;
  display: block;
  width: 100%;
  border-radius: 0.25rem;
}

.AddTodoInput input::placeholder {
  color: #d4f1f4;
}

.AddTodoInput input:focus {
  outline-color: #75e6da;
}
</style>
