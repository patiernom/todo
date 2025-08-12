<script setup lang="ts">
import { ref, nextTick, computed } from "vue";

const props = defineProps(["todo", "index"]);
const emit = defineEmits(["delete-todo", "edit-todo", "toggle-todo"]);

const editing = ref(false);
const editInput = ref(null);
const editText = ref("");

const editModel = computed({
  get() {
    return props.todo.title;
  },
  set(value) {
    editText.value = value;
  },
});

const toggleModel = computed({
  get() {
    return props.todo.completed;
  },
  set(value) {
    emit("toggle-todo", props.todo, value);
  },
});

function startEdit() {
  editing.value = true;
  nextTick(() => {
    // @ts-ignore
    editInput.value.focus();
  });
}

function finishEdit() {
  editing.value = false;
  if (editText.value.trim().length === 0) {
    deleteTodo();
  } else {
    updateTodo();
  }
}

function cancelEdit() {
  editing.value = false;
}

function deleteTodo() {
  emit("delete-todo", props.todo);
}

function updateTodo() {
  emit("edit-todo", props.todo, editText.value);
  editText.value = "";
}
</script>

<template>
  <li :class="$style.todo">
    <label>
      <input type="checkbox" :class="$style.toggle" v-model="toggleModel" />
      <unicon name="check-circle" fill="#05445e" v-if="toggleModel" />
      <unicon name="circle" fill="#05445e" v-else />
    </label>
    <div :class="$style.title">
      <input
        v-if="editing"
        id="edit-todo-input"
        ref="editInput"
        type="text"
        :class="$style.editInput"
        v-model="editModel"
        @keyup.enter="finishEdit"
        @blur="cancelEdit"
      />
      <label v-else @dblclick="startEdit">{{ todo.title }}</label>
    </div>
    <a @click.prevent="deleteTodo">
      <unicon name="times" fill="#05445e" />
    </a>
  </li>
</template>

<style module>
.todo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  justify-items: flex-start;
  gap: 1rem;
}

.todo label {
  cursor: pointer;
}

.todo label,
.todo a {
  display: flex;
}

.title {
  flex: 1;
  width: 100%;
}

.title label {
  text-align: left;
  display: block;
}

.title label,
.title input {
  width: 100%;
}

.toggle {
  height: 0;
  width: 0;
  margin: 0;
}

.editInput {
  border: none;
  color: #05445e;
  font-size: 1rem;
  padding: 0.5rem 0.25rem;
  display: block;
  width: 100%;
  border-radius: 0.25rem;
}

.editInput::placeholder {
  color: #d4f1f4;
}

.editInput:focus {
  outline-color: #75e6da;
}
</style>
