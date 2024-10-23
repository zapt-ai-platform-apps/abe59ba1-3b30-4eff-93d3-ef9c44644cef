import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./drizzle/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.NEON_DB_URL,
  },
});