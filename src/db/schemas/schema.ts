import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const site = pgTable(
  "site",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    domain: text("domain").unique(),
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
  },
  (table) => [
    index("site_domain_idx").on(table.domain),
    index("site_workspaceId_idx").on(table.workspaceId),
  ],
);

export const page = pgTable(
  "page",
  {
    content: jsonb("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    id: text("id").primaryKey(),
    siteId: text("site_id")
      .notNull()
      .references(() => site.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    status: text("status").default("draft").notNull(),
    title: text("title").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
  },
  (table) => [
    index("page_siteId_idx").on(table.siteId),
    index("page_siteId_slug_idx").on(table.siteId, table.slug),
    index("page_workspaceId_idx").on(table.workspaceId),
  ],
);

export const siteRelations = relations(site, ({ many }) => ({
  pages: many(page),
}));

export const pageRelations = relations(page, ({ one }) => ({
  site: one(site, { fields: [page.siteId], references: [site.id] }),
}));
