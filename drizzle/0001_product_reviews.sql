CREATE TABLE `product_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`author_name` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "product_reviews_name_length" CHECK(length("product_reviews"."author_name") BETWEEN 2 AND 60),
	CONSTRAINT "product_reviews_body_length" CHECK(length("product_reviews"."body") BETWEEN 10 AND 2000)
);
--> statement-breakpoint
CREATE INDEX `product_reviews_product_created` ON `product_reviews` (`product_id`,`created_at`,`id`);