import type { Todo } from "~/lib/types";

export const useTodos = () => {
    const todos = useState<Todo[]>('todos', () => []);
    return todos;
};