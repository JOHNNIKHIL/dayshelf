# DayShelf V2 — Planning + UI Redesign

This is an overlay update for the current DayShelf repository.

## What it adds

- Full application navigation instead of scattered page headers.
- Redesigned visual system: softer surfaces, better hierarchy, responsive sidebar/mobile nav.
- Dashboard redesigned around Today, Planning, Goals, Habits and Insights.
- Removes the old "Later / V1 core / coming soon" UI language.
- Goal management with milestones and progress.
- Monthly planning with objectives.
- Lightweight habit tracking for the last 7 days.
- New planning/goal/habit routes.
- V2 Prisma schema and migration.
- Daily journal remains the center of the system.

## Apply

Extract over the current repository.

Then:

```powershell
npm run db:deploy
npm run db:generate
npm run build
```

Then:

```powershell
npm run dev
```

## Routes

- `/dashboard`
- `/today`
- `/planning`
- `/goals`
- `/goals/:id`
- `/habits`
- `/calendar`
- `/insights`

No existing Day/DayEvent/DayPlan data is deleted by migration 0003. The migration only adds V2 tables and optional links from DayPlan to Goal/Milestone.
