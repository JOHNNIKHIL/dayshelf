# DayShelf V1 setup

## What changed

V1 introduces the journal domain tables and `/today`.

### Database

- `Mood` enum
- `day`
- `day_event`
- `day_plan`
- `user.days` relation
- unique `(userId, date)` constraint
- ownership and ordering indexes

### UI

- dashboard now summarizes today's journal
- `/today` creates today's Day automatically
- mood selector
- Energy, Stress, Productivity, Social and Sleep scores
- thoughts/highlights/wins/gratitude/challenges
- timeline creation/deletion
- daily plan creation/completion/deletion

## Deployment

For an existing Supabase database, deploy the migration with:

```powershell
npm run db:deploy
```

Do not run `prisma migrate reset` against the shared Supabase database.
