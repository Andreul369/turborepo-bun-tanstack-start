import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  customType,
  foreignKey,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

type NumericConfig = {
  precision?: number;
  scale?: number;
};

export const numericCasted = customType<{
  data: number;
  driverData: string;
  config: NumericConfig;
}>({
  dataType: (config) => {
    if (config?.precision && config?.scale) {
      return `numeric(${config.precision}, ${config.scale})`;
    }
    return "numeric";
  },
  fromDriver: (value: string) => Number.parseFloat(value),
  toDriver: (value: number) => value.toString(),
});

export const invitations = pgTable(
  "invitations",
  {
    id: uuid().primaryKey().notNull(),
    teamId: uuid("team_id").notNull(),
    email: varchar({ length: 255 }).notNull(),
    role: text("role").notNull().default("member"),
    invitedBy: uuid("invited_by").notNull(),
    invitedAt: timestamp("invited_at", { mode: "string" }).defaultNow().notNull(),
    status: varchar({ length: 20 }).default("pending").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.invitedBy],
      foreignColumns: [users.id],
      name: "invitations_invited_by_users_id_fk",
    }),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: "invitations_team_id_teams_id_fk",
    }),
    // virtual enum check
    check("invitations_role_check", sql`${table.status} in ('member', 'admin')`),
    check(
      "invitations_status_check",
      sql`${table.status} in ('pending', 'accepted', 'expired', 'revoked')`,
    ),
  ],
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    teamId: uuid("team_id").notNull(),
    role: varchar({ length: 50 }).notNull(),
    joinedAt: timestamp("joined_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: "team_members_team_id_teams_id_fk",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "team_members_user_id_users_id_fk",
    }),
  ],
);

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid().primaryKey().notNull(),
    teamId: uuid("team_id").notNull(),
    userId: uuid("user_id"),
    action: text().notNull(),
    timestamp: timestamp({ mode: "string" }).defaultNow().notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
  },
  (table) => [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: "activity_logs_team_id_teams_id_fk",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "activity_logs_user_id_users_id_fk",
    }),
    check(
      "activity_logs_action_check",
      sql`action = ANY (ARRAY['SIGN_UP'::text, 'SIGN_IN'::text, 'SIGN_OUT'::text, 'UPDATE_PASSWORD'::text, 'DELETE_ACCOUNT'::text, 'UPDATE_ACCOUNT'::text, 'CREATE_TEAM'::text, 'REMOVE_TEAM_MEMBER'::text, 'INVITE_TEAM_MEMBER'::text, 'ACCEPT_INVITATION'::text])`,
    ),
  ],
);

export const teams = pgTable(
  "teams",
  {
    id: uuid().primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeProductId: text("stripe_product_id"),
    planName: varchar("plan_name", { length: 50 }),
    subscriptionStatus: varchar("subscription_status", { length: 20 }),
  },
  (table) => [
    unique("teams_stripe_customer_id_unique").on(table.stripeCustomerId),
    unique("teams_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey().notNull(),
    fullName: text("full_name").notNull(),
    avatarUrl: text("avatar_url"),
    email: text().notNull(),
    role: text("role").default("member").notNull(),
    locale: text("password_hash").notNull(),
    weekStartsOnMonday: boolean("week_starts_on_monday").default(false),
    timezone: text(),
    dateFormat: text("date_format"),
    timeFormat: numericCasted("time_format").default(24),
    timezoneAutoSync: boolean("timezone_auto_sync").default(true),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => [
    unique("users_email_unique").on(table.email),
    // virtual enum check
    check("users_role_check", sql`${table.role} in ('admin', 'member')`),
  ],
);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  user: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  invitations: many(invitations),
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  invitations: many(invitations),
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));
