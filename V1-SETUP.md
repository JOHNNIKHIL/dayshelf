# DayShelf V1 setup

After extracting this milestone into your existing repository:

```powershell
npm install
npm run db:generate
npm run db:deploy
npm run lint
npm run build
```

Then open:

- `/dashboard`
- `/today`
- `/calendar`

The calendar creates/open journal days through the same ownership-checked Day model. Historical dates are supported with `/today?date=YYYY-MM-DD`.

Do not run `prisma migrate reset` against the Supabase database.
