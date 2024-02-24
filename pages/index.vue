<script setup lang="ts">
import type { Todo } from "~/lib/types";

definePageMeta({
  middleware: "todo",
});

const user = useUser();
const todos = useTodos();

async function newTodo(event: Event) {
  event.preventDefault();
  if (!user.value) return;

  const formData = new FormData(event.target as HTMLFormElement);
  const content = formData.get("content") as string;

  if (!content) return;

  const result = await $fetch<Todo>("/api/todos/new", {
    method: "POST",
    body: { content },
  });

  if (result) {
    todos.value.push(result);
  }
}

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  await reloadNuxtApp();
}
</script>

<template>
  <div v-if="user" class="max-w-lg mx-auto flex flex-col gap-2 py-2">
    <h1 class="text-2xl font-bold text-center">Todos</h1>
    <span class="text-sm text-center">Welcome back, {{ user.username }}</span>
    <UButton color="red" variant="solid" class="w-fit mx-auto" @click="logout">
      Logout
    </UButton>

    <form class="flex w-full gap-2" @submit.prevent="newTodo">
      <UInput
        id="content"
        name="content"
        type="text"
        placeholder="New todo"
        class="w-full"
      />
      <UButton type="submit" color="primary" variant="solid"> Add </UButton>
    </form>
    <div class="flex flex-col gap-2">
      <Todo
        v-for="todo in todos"
        :id="todo.id"
        :key="todo.id"
        :user-id="todo.userId"
        :content="todo.content"
        :status="todo.status"
        :created-at="todo.createdAt"
      />
    </div>
  </div>
  <div v-else class="max-w-lg mx-auto flex flex-col gap-2 py-2">
    <h1 class="text-2xl font-bold text-center">Todos</h1>
    <span class="text-sm text-center">You need to login to see your todos</span>

    <div class="flex gap-2 w-full">
      <UButton
        class="w-1/2 text-center justify-center"
        color="primary"
        variant="solid"
        to="/auth/login"
      >
        Login
      </UButton>
      <UButton
        class="w-1/2 text-center justify-center"
        color="primary"
        variant="solid"
        to="/auth/register"
      >
        Register
      </UButton>
    </div>
  </div>
</template>
