import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  integrations: jsonb("integrations").default([]).$type<Integration[]>(),
  createdAt: text("created_at").notNull(),
});

export const integrationSchema = z.object({
  integrationName: z.string(),
  integrationLogo: z.string().optional(),
});

export type Integration = z.infer<typeof integrationSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  companyName: true,
  integrations: true,
}).extend({
  integrations: z.array(integrationSchema).optional().default([]),
});

export const updateCompanySchema = insertCompanySchema.extend({
  id: z.number(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type UpdateCompany = z.infer<typeof updateCompanySchema>;
