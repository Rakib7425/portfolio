import { pgTable, text, timestamp, boolean, integer, uuid, index } from 'drizzle-orm/pg-core';
// import { sql } from 'drizzle-orm';

// Admin User
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// Profile Information
export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  bio: text('bio').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  location: text('location'),
  photoUrl: text('photoUrl'),
  resumeUrl: text('resumeUrl'),
  githubUrl: text('githubUrl'),
  linkedinUrl: text('linkedinUrl'),
  twitterUrl: text('twitterUrl'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// Skills
export const skills = pgTable('skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  proficiency: integer('proficiency').default(0).notNull(),
  icon: text('icon'),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// Work Experience
export const experiences = pgTable('experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  company: text('company').notNull(),
  position: text('position').notNull(),
  location: text('location'),
  startDate: timestamp('startDate', { mode: 'date' }).notNull(),
  endDate: timestamp('endDate', { mode: 'date' }),
  current: boolean('current').default(false).notNull(),
  description: text('description').notNull(),
  technologies: text('technologies').array(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// Projects
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  longDesc: text('longDesc'),
  imageUrl: text('imageUrl').notNull(),
  technologies: text('technologies').array(),
  liveUrl: text('liveUrl'),
  repoUrl: text('repoUrl'),
  featured: boolean('featured').default(false).notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// Contact Form Submissions
export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  read: boolean('read').default(false).notNull(),
  replied: boolean('replied').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// Page Views Analytics
export const pageViews = pgTable('page_views', {
  id: uuid('id').defaultRandom().primaryKey(),
  page: text('page').notNull(),
  userAgent: text('userAgent'),
  ipAddress: text('ipAddress'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    pageIdx: index('page_views_page_idx').on(table.page),
    createdAtIdx: index('page_views_createdAt_idx').on(table.createdAt),
  };
});

// Project Views Analytics
export const projectViews = pgTable('project_views', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('projectId').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userAgent: text('userAgent'),
  ipAddress: text('ipAddress'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    projectIdIdx: index('project_views_projectId_idx').on(table.projectId),
    createdAtIdx: index('project_views_createdAt_idx').on(table.createdAt),
  };
});

// SEO Metadata
export const seoMeta = pgTable('seo_meta', {
  id: uuid('id').defaultRandom().primaryKey(),
  page: text('page').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  keywords: text('keywords').array(),
  ogImage: text('ogImage'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// Newsletter Subscribers
export const subscribers = pgTable('subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// Policy pages (Privacy Policy, Terms of Service) - editable from admin
export const policyPages = pgTable('policy_pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date()),
});
