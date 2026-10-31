CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`created_at` text NOT NULL,
	`customer` text NOT NULL,
	`items` text NOT NULL,
	`subtotal` integer NOT NULL,
	`delivery` integer,
	`delivery_type` text NOT NULL,
	`payment` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`op_token` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`max_length` integer NOT NULL,
	`width` integer NOT NULL,
	`thickness` integer NOT NULL,
	`rate` integer NOT NULL,
	`remaining_cm` integer NOT NULL,
	`active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
