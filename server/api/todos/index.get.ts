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

    const userTodos = await db.query.todos.findMany({
        where: eq(todos.userId, userId),
    });

    return [...userTodos]
});