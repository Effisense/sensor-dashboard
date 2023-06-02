CREATE TABLE `Container` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`targetFillLevelInPercent` int NOT NULL,
	`binHeightInMillimeters` int NOT NULL,
	`binWidthInMillimeters` int,
	`sensorOffsetInMillimeters` int,
	`containerVolumeInLiters` int,
	`organizationId` int);

CREATE TABLE `Organization` (
	`id` text PRIMARY KEY NOT NULL);

CREATE TABLE `Sensor` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`latitude` float NOT NULL,
	`longitude` float NOT NULL,
	`location` text NOT NULL,
	`organizationId` int,
	`containerId` int);

CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL);

CREATE TABLE `UserInOrganization` (
	`userId` int NOT NULL,
	`organizationId` int NOT NULL,
	PRIMARY KEY(`organizationId`,`userId`)
);
