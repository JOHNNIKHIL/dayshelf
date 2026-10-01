# DayShelf V0 Final Build Fixes

These files are based on the latest pushed `JOHNNIKHIL/dayshelf` repository and the latest local build errors.

## Bugs fixed

### 1. Better Auth client API mismatch

The project exported only `authClient` from `src/lib/auth-client.ts`, while the pages imported `signIn` and `signUp` as top-level exports.

Fixed to use the documented client API:

```ts
await authClient.signIn.email({ email, password });
await authClient.signUp.email({ name, email, password });
```

### 2. Dashboard sign-out component missing

Added:

```text
app/dashboard/sign-out-button.tsx
```

### 3. Dashboard import path mismatch

Because the recommended TypeScript alias is:

```json
"@/*": ["./src/*"]
```

the dashboard now imports the local component with:

```ts
import { SignOutButton } from "./sign-out-button";
```

### 4. `@/*` alias

The canonical source-library structure is:

```text
src/lib/auth.ts
src/lib/auth-client.ts
src/lib/prisma.ts
src/generated/prisma/client.ts
```

Therefore `@/*` maps to `./src/*`.

## Apply

Copy the files from this fix pack into the project, preserving the directory structure.

Then run:

```powershell
Remove-Item .next -Recurse -Force
npm run db:generate
npm run build
```

If the build succeeds:

```powershell
npm run lint
```

Do not run `npm audit fix --force`.
Do not upgrade Prisma to 8 RC.
Do not commit `.env`, `.env.local`, database passwords, or Better Auth secrets.
