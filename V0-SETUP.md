# DayShelf V0 — exact next steps

The ZIP contains no real database password and no Better Auth secret.

1. Copy `.env.example` to `.env.local`.
2. Replace `[YOUR-PASSWORD]` in both Supabase URLs with your database password.
3. Generate a secret with `openssl rand -base64 32` and put it in `BETTER_AUTH_SECRET`.
4. Run `npm install`.
5. Run `npm run db:generate`.
6. Run `npm run db:deploy` to apply the included Better Auth migration.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Run `npm run dev`.

Google OAuth is deliberately not configured in V0.
