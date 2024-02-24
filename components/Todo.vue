<script setup lang="ts">
import type { Todo } from "~/lib/types";

const props = defineProps<Todo>();
const todos = useTodos();

const options = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "in_progress", label: "In Progress" },
];

async function changeStatus(event: Event) {
  const status = (event.target as HTMLSelectElement).value;
  const result = await $fetch<Todo>("/api/todos/update", {
    method: "POST",
    body: { id: props.id, status },
  });

  if (result) {
    todos.value = todos.value.map((todo) => {
      if (todo.id === result.id) {
        return result;
      }
      return todo;
    });
  }
}

async function deleteTodo() {
  const result = await $fetch<Todo>("/api/todos/delete", {
    method: "POST",
    body: { id: props.id },
  });

  if (result) {
    todos.value = todos.value.filter((todo) => todo.id !== props.id);
  }
}
</script>

<template>
  <div
    class="flex w-full items-center justify-between rounded-xl bg-primary py-1 px-3"
  >
    <p class="text-base whitespace-normal break-all w-[80%]">
      {{ props.content }}
    </p>

    <div class="flex gap-1">
      <USelect
        :options="options"
        :model-value="props.status"
        color="primary"
        variant="none"
        @change="changeStatus"
      />
      <UButton
        color="primary"
        variant="outline"
        class="p-1.5 w-7 h-7 self-center grid place-items-center"
        @click="deleteTodo"
      >
        <UIcon name="i-heroicons-trash-solid" class="w-full h-full" />
      </UButton>
    </div>
  </div>
</template>
