CREATE TABLE `customer_auth_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `customer_auth_limits_expiry` ON `customer_auth_limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `customer_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `customer_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `customer_sessions_expiry` ON `customer_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `customer_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_users_email_unique` ON `customer_users` (`email`);--> statement-breakpoint
ALTER TABLE `product_reviews` ADD `user_id` text REFERENCES customer_users(id) ON DELETE SET NULL;
