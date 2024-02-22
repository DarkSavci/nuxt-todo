import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { db } from "~/server/db/db";
import { users } from "~/server/db/schema";
import { lucia } from "~/server/utils/auth";

export default eventHandler(async (event) => {
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

    const [user] = await db.select().from(users).where(eq(users.username, username));

    if (!user) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid usernames from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid usernames.
        // However, valid usernames can be already be revealed with the signup page among other methods.
        // It will also be much more resource intensive.
        // Since protecting against this is none-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // If usernames are public, you may outright tell the user that the username is invalid.
        throw createError({
            message: "Incorrect username or password",
            statusCode: 400
        });
    }

    const validPassword = await new Argon2id().verify(user.hashedPassword, password);
    if (!validPassword) {
        throw createError({
            message: "Incorrect username or password",
            statusCode: 400
        });
    }

    const session = await lucia.createSession(user.id, {});
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
});