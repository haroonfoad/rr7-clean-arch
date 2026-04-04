CREATE TABLE
	IF NOT EXISTS `users` (
		`id` text PRIMARY KEY NOT NULL,
		`username` text NOT NULL,
		`password` text NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_username_unique` ON `users` (`username`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `departments` (
		`id` text PRIMARY KEY NOT NULL,
		`name` text NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `organizations` (
		`id` text PRIMARY KEY NOT NULL,
		`name` text NOT NULL
	);