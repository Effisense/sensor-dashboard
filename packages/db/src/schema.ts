import { relations } from "drizzle-orm";
import {
  primaryKey,
  serial,
  float,
  text,
  mysqlTable,
  int,
} from "drizzle-orm/mysql-core";

export const User = mysqlTable("User", {
  id: serial("id").primaryKey(),
});

export const UserRelations = relations(User, ({ many }) => ({
  UserInOrganization: many(UserInOrganization),
}));

export const Organization = mysqlTable("Organization", {
  id: serial("id").primaryKey(),
});

export const OrganizationRelations = relations(Organization, ({ many }) => ({
  Container: many(Container),
  Sensor: many(Sensor),
  UserInOrganization: many(UserInOrganization),
}));

export const UserInOrganization = mysqlTable(
  "UserInOrganization",
  {
    userId: int("userId").notNull(),
    organizationId: int("organizationId").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.userId, table.organizationId),
    };
  },
);

export const UserInOrganizationRelations = relations(
  UserInOrganization,
  ({ one }) => ({
    User: one(User, {
      fields: [UserInOrganization.userId],
      references: [User.id],
    }),
    Organization: one(Organization, {
      fields: [UserInOrganization.organizationId],
      references: [Organization.id],
    }),
  }),
);

export const Container = mysqlTable("Container", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  targetFillLevelInPercent: int("targetFillLevelInPercent").notNull(),
  binHeightInMillimeters: int("binHeightInMillimeters").notNull(),
  binWidthInMillimeters: int("binWidthInMillimeters"),
  sensorOffsetInMillimeters: int("sensorOffsetInMillimeters"),
  containerVolumeInLiters: int("containerVolumeInLiters"),

  organizationId: int("organizationId"),
});

export const ContainerRelations = relations(Container, ({ one }) => ({
  Organization: one(Organization, {
    fields: [Container.organizationId],
    references: [Organization.id],
  }),
}));

export const Sensor = mysqlTable("Sensor", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  location: text("location").notNull(),

  organizationId: int("organizationId"),
  containerId: int("containerId"),
});

export const SensorRelations = relations(Sensor, ({ one }) => ({
  Organization: one(Organization, {
    fields: [Sensor.organizationId],
    references: [Organization.id],
  }),
  Container: one(Container, {
    fields: [Sensor.containerId],
    references: [Container.id],
  }),
}));
