ALTER TABLE `Container` MODIFY COLUMN `organizationId` varchar(64) NOT NULL;
ALTER TABLE `Sensor` MODIFY COLUMN `organizationId` varchar(64) NOT NULL;
ALTER TABLE `Sensor` MODIFY COLUMN `containerId` varchar(64);
ALTER TABLE `UserInOrganization` MODIFY COLUMN `userId` varchar(64) NOT NULL;
ALTER TABLE `UserInOrganization` MODIFY COLUMN `organizationId` varchar(64) NOT NULL;