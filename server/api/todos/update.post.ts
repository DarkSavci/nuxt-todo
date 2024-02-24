import { and, eq } from "drizzle-orm";
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

    const { id, status } = await readBody(event);

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Id is required"
        });
    }

    if (!status) {
        throw createError({
            statusCode: 400,
            statusMessage: "Status is required"
        });
    }

    if (["pending", "in_progress", "completed"].indexOf(status) === -1) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid status"
        });
    }

    const [todo] = await db.update(todos).set({ status }).where(
        and(
            eq(todos.id, id),
            eq(todos.userId, userId)
        )
    ).returning();

    if (!todo) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to update todo"
        });
    }

    return {
        ...todo,
    }
});