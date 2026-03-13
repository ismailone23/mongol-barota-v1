import { pgTable } from "drizzle-orm/pg-core";

// Gallery categories (competitions, development, events, media)
export const galleryCategories = pgTable("gallery_categories", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  slug: t.varchar("slug", { length: 100 }).notNull().unique(),
  name: t.varchar("name", { length: 100 }).notNull(),
  icon: t.varchar("icon", { length: 50 }),
  description: t.text("description"),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type GalleryCategorySelect = typeof galleryCategories.$inferSelect;
export type GalleryCategoryInsert = typeof galleryCategories.$inferInsert;

// Gallery images
export const galleryImages = pgTable("gallery_images", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  categoryId: t
    .uuid("category_id")
    .notNull()
    .references(() => galleryCategories.id, { onDelete: "cascade" }),
  src: t.text("src").notNull(),
  title: t.text("title").notNull(),
  description: t.text("description"),
  date: t.varchar("date", { length: 20 }),
  location: t.varchar("location", { length: 200 }),
  tag: t.varchar("tag", { length: 100 }),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type GalleryImageSelect = typeof galleryImages.$inferSelect;
export type GalleryImageInsert = typeof galleryImages.$inferInsert;

// Gallery videos
export const galleryVideos = pgTable("gallery_videos", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  title: t.text("title").notNull(),
  description: t.text("description"),
  thumbnail: t.text("thumbnail"),
  url: t.text("url").notNull(),
  duration: t.varchar("duration", { length: 20 }),
  date: t.varchar("date", { length: 20 }),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type GalleryVideoSelect = typeof galleryVideos.$inferSelect;
export type GalleryVideoInsert = typeof galleryVideos.$inferInsert;
