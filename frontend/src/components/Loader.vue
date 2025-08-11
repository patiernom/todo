<script setup lang="ts"></script>

<template>
  <div :class="$style.loader"></div>
</template>

<style module>
/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  margin: 0 auto;
  aspect-ratio: 1;
  display: grid;
  border: 4px solid #189ab4;
  border-radius: 50%;
  border-right-color: #05445e;
  animation: l15 1s infinite linear;
}
.loader::before,
.loader::after {
  content: "";
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
  animation: l15 2s infinite;
}
.loader::after {
  margin: 8px;
  animation-duration: 3s;
}
@keyframes l15 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
