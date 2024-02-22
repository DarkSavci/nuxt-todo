export type Todo = {
    id: string;
    userId: string;
    content: string;
    status: "pending" | "in_progress" | "completed";
    createdAt: string;
}