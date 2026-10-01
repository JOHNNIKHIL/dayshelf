# DayShelf

Private daily life archive built with Next.js, Better Auth, Prisma 7 and PostgreSQL/Supabase.

## V1 Journal Core

This version adds the first persistent DayShelf domain model:

- `Day` — one private calendar day per user
- mood and five 1–5 dimensions
- thoughts, highlights, gratitude, challenges and wins
- `DayEvent` timeline moments
- `DayPlan` daily plans with completion tracking
- ownership checks on every server action
- `/today` protected journal editor
- dashboard summary linked to today's journal

## Local setup

1. Keep your existing `.env.local` values for `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`.
2. Run `npm install`.
3. Run `npm run db:generate`.
4. Run `npm run db:migrate -- --name add_day_journal_core` only if you are starting from the pre-V1 repository without the included migration. If the included `0002_day_journal_core` migration is present, use `npm run db:migrate`.
5. Run `npm run lint`.
6. Run `npm run build`.
7. Run `npm run dev` and open `/today` after signing in.

The default journal timezone is `Asia/Kolkata`. Set `APP_TIME_ZONE` to another IANA timezone if needed.

## Security model

Journal queries are always scoped to the authenticated Better Auth user. Client-supplied `dayId`, `eventId`, and `planId` values are re-checked server-side against ownership before mutation.

Do not commit `.env` or `.env.local` files.
