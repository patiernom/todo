<template>
  <button
    type="button"
    :class="{
      [$style.button]: true,
      [$style.primary]: variant === 'primary',
      [$style.secondary]: variant === 'secondary',
      [$style[size]]: true,
    }"
    @click="$emit('click')"
  >
    <template v-if="!$slots.default">
      {{ label }}
    </template>
    <slot />
  </button>
</template>

<script lang="ts" setup>
import "../stories/button.css";

defineSlots();

withDefaults(
  defineProps<{
    /**
     * The label of the button otherwise slot is used
     */
    label?: string;
    /**
     * primary or secondary button
     */
    variant?: "primary" | "secondary";
    /**
     * size of the button
     */
    size?: "small" | "medium" | "large";
    /**
     * background color of the button
     */
    backgroundColor?: string;
  }>(),
  { size: "medium" },
);
</script>

<style module>
.button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: Poppins, sans-serif;
  background-color: #d4f1f4;
  color: #05445e;
  cursor: pointer;
  transition: all 0.25s;
}
.primary {
  background-color: #05445e;
  color: #d4f1f4;
}

.secondary {
  background-color: #189ab4;
  color: #d4f1f4;
}

.small {
  padding: 10px 16px;
  font-size: 12px;
}
.medium {
  padding: 11px 20px;
  font-size: 14px;
}
.large {
  padding: 12px 24px;
  font-size: 16px;
}
</style>
