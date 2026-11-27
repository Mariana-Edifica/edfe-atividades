import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const tasks=sqliteTable('tasks',{id:text('id').primaryKey(),data:text('data').notNull(),version:integer('version').notNull().default(1)});
export const events=sqliteTable('events',{id:text('id').primaryKey(),data:text('data').notNull()});

export const labels=sqliteTable('labels',{id:text('id').primaryKey(),data:text('data').notNull()});
export const goals=sqliteTable('goals',{id:text('id').primaryKey(),data:text('data').notNull(),version:integer('version').notNull().default(1)});
