import { db } from "~/server/db/db";
import { todos } from "~/server/db/schema";

export default eventHandler(async (event) => {
    const userId = event.context.user.id;

    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        })
    }

    const { content } = await readBody(event);

    if (!content) {
        throw createError({
            statusCode: 400,
            statusMessage: "Content is required"
        });
    }

    const [newTodo] = await db.insert(todos).values({ content, userId }).returning();

    if (!newTodo) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to create todo"
        });
    }

    return {
        ...newTodo,
    }
});