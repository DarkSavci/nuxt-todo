import { eq } from "drizzle-orm";
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

    const { id } = await readBody(event);

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Id is required"
        });
    }

    const todo = await db.query.todos.findFirst({
        where: eq(todos.id, id),
    });

    if (!todo) {
        throw createError({
            statusCode: 404,
            statusMessage: "Todo not found"
        });
    }

    if (todo.userId !== userId) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden"
        });
    }

    const deletedTodo = await db.delete(todos).where(eq(todos.id, id)).returning();

    if (!deletedTodo) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to delete todo"
        });
    }

    return {
        ...deletedTodo,
    }
});