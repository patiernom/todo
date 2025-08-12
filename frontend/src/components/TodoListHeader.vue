<template>
  <RouterLink to="/" :class="$style.headerTitle">
    <h1>My Todo-s</h1>
  </RouterLink>
</template>
<script>
export default {
  name: "TodoListHeader",
};
</script>
<style module>
.headerTitle {
  font-weight: 500;
  color: #05445e;
  text-decoration: none;
  cursor: pointer;
}

.headerTitle:hover {
  color: #189ab4;
}

.headerTitle h1 {
  font-size: 3.2em;
  line-height: 1.1;
  text-align: center;
  opacity: 0.4;
}
</style>
