<script setup lang="ts">
import TodoList from "@/components/TodoList.vue";
import useTodos from "@/store/useTodos.ts";
import Loader from "@/components/Loader.vue";

const { loaded } = useTodos();
</script>

<template>
  <TodoList v-if="loaded" />
  <Loader v-else />
</template>

<style module></style>
