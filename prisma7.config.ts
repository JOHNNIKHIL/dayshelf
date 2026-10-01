import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // Use the direct/session connection for Prisma migrations.
    // The application runtime continues to use DATABASE_URL.
    url: process.env["DIRECT_URL"],
  },
});
