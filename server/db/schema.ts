import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable('user', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: text('username').unique().notNull(),
    hashedPassword: text('hashed_password').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
    todos: many(todos)
}))

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export const sessions = pgTable("session", {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull()
});

export const todos = pgTable('todo', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id),
    content: text('content').notNull(),
    status: text('status', { enum: ["pending", "in_progress", "completed"] }).notNull().default('pending'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow()
});

export const todosRelations = relations(todos, ({ one }) => ({
    user: one(users)
}))

export type Todo = InferSelectModel<typeof todos>;
export type InsertTodo = InferInsertModel<typeof todos>;