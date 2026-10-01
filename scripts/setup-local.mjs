import { existsSync, copyFileSync } from "node:fs";

if (!existsSync(".env.local")) {
  copyFileSync(".env.example", ".env.local");
  console.log("Created .env.local from .env.example. Replace the placeholders before running Prisma.");
} else {
  console.log(".env.local already exists; leaving it unchanged.");
}
