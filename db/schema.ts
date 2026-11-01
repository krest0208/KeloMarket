import { sqliteTable, text, integer, index, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export const products = sqliteTable("products", {
  id: text("id").primaryKey(), name: text("name").notNull(), category: text("category").notNull(),
  description: text("description").notNull(), image: text("image").notNull(),
  maxLength: integer("max_length").notNull(), width: integer("width").notNull(),
  thickness: integer("thickness").notNull(), rate: integer("rate").notNull(),
  remainingCm: integer("remaining_cm").notNull(), stockUnits: integer("stock_units"), active: integer("active").notNull().default(1),
});
export const settings = sqliteTable("settings", {key: text("key").primaryKey(), value: text("value").notNull()});
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), reference: text("reference").notNull(), createdAt: text("created_at").notNull(),
  customer: text("customer").notNull(), items: text("items").notNull(), subtotal: integer("subtotal").notNull(),
  delivery: integer("delivery"), deliveryType: text("delivery_type").notNull(), payment: text("payment").notNull(),
  status: text("status").notNull().default("new"), opToken: text("op_token").notNull(),
});
export const productReviews = sqliteTable("product_reviews", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull(),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
}, table => [
  index("product_reviews_product_created").on(table.productId, table.createdAt, table.id),
  check("product_reviews_name_length", sql`length(${table.authorName}) BETWEEN 2 AND 60`),
  check("product_reviews_body_length", sql`length(${table.body}) BETWEEN 10 AND 2000`),
]);
