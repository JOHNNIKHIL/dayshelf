# DayShelf

DayShelf is a private personal life archive built with Next.js, Better Auth, Prisma and Supabase PostgreSQL.

## V0 — Authentication Foundation

This milestone establishes:

- Next.js 16 App Router
- Better Auth email/password authentication
- Prisma 7 + PostgreSQL
- Supabase pooled runtime connection
- Supabase direct connection for Prisma CLI/migrations
- Protected `/dashboard`
- Sign up / sign in / sign out
- A calm DayShelf visual foundation

Google OAuth is intentionally deferred and can be added later without replacing Better Auth.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Paste the two Supabase connection strings into `DATABASE_URL` and `DIRECT_URL`.
3. Generate a Better Auth secret:

```bash
openssl rand -base64 32
```

4. Put that value in `BETTER_AUTH_SECRET`.
5. Install dependencies:

```bash
npm install
```

6. The V0 ZIP already contains the initial Better Auth migration. Apply it with:

```bash
npm run db:deploy
```

If you later change Better Auth configuration/plugins, run `npm run auth:generate`, review the schema, then create a new Prisma migration with `npm run db:migrate -- --name <change-name>`.

7. Generate Prisma Client:

```bash
npm run db:generate
```

8. Start the application:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Important

- Never commit `.env`, `.env.local`, database URLs, or Better Auth secrets.
- The Supabase password is not included in this repository or ZIP.
- Do not enable Supabase Auth; Better Auth owns authentication.
- `DATABASE_URL` is the pooled runtime connection.
- `DIRECT_URL` is used by Prisma CLI for migrations.

## Roadmap

- V0: Authentication foundation
- V1: Daily journal, mood, timeline, calendar
- V1.5: Weekly/monthly insights
- V2: Plans, goals, milestones, habits
- V2.5: Memories, tags, attachments, On This Day
- V3: Invite-only access, audit logs, export/delete, production hardening
- V4: Optional privacy-first AI reflection
