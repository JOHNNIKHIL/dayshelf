# DayShelf V0 Auth/Build Fix Pack

This patch addresses the build errors encountered in the DayShelf V0 auth foundation.

## Bugs addressed

1. Duplicate App Router routes:
   - `app/(auth)/sign-in`
   - `app/sign-in`
   - `app/(auth)/sign-up`
   - `app/sign-up`

   The `(auth)` route group must be removed because both route groups resolve to `/sign-in` and `/sign-up`.

2. Missing server-side Better Auth configuration:
   - `src/lib/auth.ts`

3. Missing dashboard sign-out component:
   - `app/dashboard/sign-out-button.tsx`

4. Prisma generated client could not be resolved through `@/*` because the generated client lives under `src/generated/prisma` while the alias previously pointed to the project root.
   - `tsconfig.json` now maps `@/*` to `src/*`.

5. Stale `.next` generated route/type files may still reference deleted `(auth)` routes.
   - Delete `.next` before rebuilding.

## Apply manually

Copy the files in this ZIP into the project root, preserving their paths.

Then remove the old duplicate route directory:

`app/(auth)`

Then run:

`Remove-Item .next -Recurse -Force`

`npm run db:generate`

`npm run build`

## Important

- Do NOT run `npm audit fix --force` during this V0 stabilization.
- Do NOT upgrade Prisma to 8 RC yet.
- Do NOT put real secrets/passwords into this ZIP or Git.
