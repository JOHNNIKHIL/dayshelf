# DayShelf

DayShelf is a private daily archive built with Next.js, Better Auth, Prisma 7 and PostgreSQL/Supabase.

## Current milestone

### V1 — Journal Core
- Protected daily journal at `/today`
- Mood and 1–5 life metrics
- Thoughts, highlights, gratitude, challenges and wins
- Timeline events
- Daily plans and completion tracking
- Calendar at `/calendar`
- Historical day navigation from the calendar
- User-scoped journal operations

## Local setup

1. Install dependencies:
   `npm install`
2. Configure `.env.local` using `.env.example`.
3. Generate Prisma client:
   `npm run db:generate`
4. Apply local development migrations:
   `npm run db:migrate -- --name local_sync`
5. Start:
   `npm run dev`

## Production database

After verifying locally, use `npm run db:deploy` for the committed migration history.

Never commit `.env.local`, database passwords, Better Auth secrets, or generated Prisma output.
