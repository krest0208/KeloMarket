import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const products = sqliteTable("products", {
  id: text("id").primaryKey(), name: text("name").notNull(), category: text("category").notNull(),
  description: text("description").notNull(), image: text("image").notNull(),
  maxLength: integer("max_length").notNull(), width: integer("width").notNull(),
  thickness: integer("thickness").notNull(), rate: integer("rate").notNull(),
  remainingCm: integer("remaining_cm").notNull(), active: integer("active").notNull().default(1),
});
export const settings = sqliteTable("settings", {key: text("key").primaryKey(), value: text("value").notNull()});
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), reference: text("reference").notNull(), createdAt: text("created_at").notNull(),
  customer: text("customer").notNull(), items: text("items").notNull(), subtotal: integer("subtotal").notNull(),
  delivery: integer("delivery"), deliveryType: text("delivery_type").notNull(), payment: text("payment").notNull(),
  status: text("status").notNull().default("new"), opToken: text("op_token").notNull(),
});
