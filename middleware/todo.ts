import type { Todo } from "~/lib/types";

export default defineNuxtRouteMiddleware(async () => {
    const todos = useTodos();

    const result = await useFetch<Todo[]>("/api/todos");
    if (result.data.value) {
        todos.value = result.data.value;
    }
});