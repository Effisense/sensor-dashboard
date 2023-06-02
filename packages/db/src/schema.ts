import { InferModel, relations } from "drizzle-orm";
import {
  primaryKey,
  serial,
  float,
  text,
  mysqlTable,
  int,
  varchar,
} from "drizzle-orm/mysql-core";

const ID_LENGTH = 64;

export const User = mysqlTable("User", {
  id: varchar("id", { length: ID_LENGTH }).primaryKey(),
});
export const UserRelations = relations(User, ({ many }) => ({
  UserInOrganization: many(UserInOrganization),
}));
export type UserSchema = InferModel<typeof User>;

export const Organization = mysqlTable("Organization", {
  id: varchar("id", { length: ID_LENGTH }).primaryKey(),
});
export const OrganizationRelations = relations(Organization, ({ many }) => ({
  Container: many(Container),
  Sensor: many(Sensor),
  UserInOrganization: many(UserInOrganization),
}));
export type OrganizationSchema = InferModel<typeof Organization>;

export const UserInOrganization = mysqlTable(
  "UserInOrganization",
  {
    userId: varchar("userId", { length: ID_LENGTH }).notNull(),
    organizationId: varchar("organizationId", { length: ID_LENGTH }).notNull(),
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
export type UserInOrganizationSchema = InferModel<typeof UserInOrganization>;

export const Container = mysqlTable("Container", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  targetFillLevelInPercent: int("targetFillLevelInPercent").notNull(),
  binHeightInMillimeters: int("binHeightInMillimeters").notNull(),
  binWidthInMillimeters: int("binWidthInMillimeters"),
  sensorOffsetInMillimeters: int("sensorOffsetInMillimeters"),
  containerVolumeInLiters: int("containerVolumeInLiters"),

  organizationId: varchar("organizationId", { length: ID_LENGTH }),
});
export const ContainerRelations = relations(Container, ({ one }) => ({
  Organization: one(Organization, {
    fields: [Container.organizationId],
    references: [Organization.id],
  }),
}));
export type ContainerSchema = InferModel<typeof Container>;

export const Sensor = mysqlTable("Sensor", {
  id: varchar("id", { length: ID_LENGTH }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  location: text("location").notNull(),
  collectionId: varchar("collectionId", { length: ID_LENGTH }).notNull(),

  organizationId: varchar("organizationId", { length: ID_LENGTH }).notNull(),
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
export type SensorSchema = InferModel<typeof Sensor>;
