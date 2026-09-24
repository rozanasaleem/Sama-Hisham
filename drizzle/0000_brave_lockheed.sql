CREATE TABLE `rsvps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guest_name` text,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`plus_one_name` text,
	`attending` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
