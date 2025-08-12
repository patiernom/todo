<script setup lang="ts">
import TodoList from "@/components/TodoList.vue";
import useTodos from "@/store/useTodos.ts";
import Loader from "@/components/Loader.vue";

const { loaded, error } = useTodos();
</script>

<template>
  <div v-if="error">{{ error }}</div>
  <TodoList v-else-if="loaded" />
  <Loader v-else />
</template>

<style module></style>
