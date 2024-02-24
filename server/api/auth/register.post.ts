import { Argon2id } from "oslo/password";
import { db } from "~/server/db/db";
import { users } from "~/server/db/schema";
import { lucia } from "~/server/utils/auth";

export default eventHandler(async (event) => {
    // Get body unjs nitro
    const { username, password } = await readBody(event);

    if (typeof username !== "string") {
        throw createError({
            message: "Invalid username",
            statusCode: 400
        });
    }
    if (typeof password !== "string") {
        throw createError({
            message: "Invalid password",
            statusCode: 400
        });
    }

    const hashedPassword = await new Argon2id().hash(password);

    // TODO: check if username is already used
    const [user] = await db.insert(users).values({
        username,
        hashedPassword
    }).returning();

    if (!user) {
        throw createError({
            message: "Failed to create user",
            statusCode: 500
        });
    }

    const session = await lucia.createSession(user.id, {});
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
});