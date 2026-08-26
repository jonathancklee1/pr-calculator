# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`) — don't use npm/yarn.

- `pnpm dev` — start the Next.js dev server at localhost:3000
- `pnpm build` — production build; `next.config.ts` sets `output: "export"`, so this emits a static site to `out/`
- `pnpm lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- There is no test suite configured in this repo.

### Mobile (Capacitor)

The web app is wrapped as a native shell for Android/iOS via Capacitor (`android/`, `ios/`, `capacitor.config.ts`).

- `pnpm build` then `npx cap sync` to copy the static export into the native projects
- `npx cap open android` / `npx cap open ios` to open the native IDEs
- `capacitor.config.ts` currently sets `server.url` to `http://localhost:3000` for dev live-reload; when `server.url` is set, Capacitor loads from that URL instead of the bundled `webDir` (`out`) — this needs to be removed/changed for a real production build.

## Architecture

- **Two independent data sources, by design:**
  - Exercise catalog data (names, GIFs, body parts) comes from the external ExerciseDB API (`oss.exercisedb.dev`), fetched server-side through the wrappers in `api/*.tsx` (`getExercises`, `getExercise`, `getSearchExercise`, `getBodyParts`) and called from the server components in `app/exercises/*` (hourly revalidation via `next: { revalidate: 3600 }`).
  - The user's actual PR records are **local-only**: `context/PrContext.tsx` (`PrStateProvider` / `usePrState`) persists to `localStorage` under key `"pr-state"`. State is hydrated in a `useEffect` after mount (not on initial render) to avoid an SSR/localStorage mismatch — follow that pattern if you touch this provider. There is no backend/database for PR data.
- **Types**: `lib/types.ts` is the single source of truth — don't confuse `ExerciseData` (shape returned by the external API) with `ExerciseRecord`/`ExerciseType` (the shape of a locally-saved PR).
- **PR math**: `getOneRepMax(weight, reps)` in `lib/constants.ts` is the one formula used everywhere a PR is saved/displayed (see `components/add-pr/PrFormSection.tsx`). `CATEGORIES` there drives the body-part filter pills on `/exercises`.
- **Components are grouped by feature, not by type**: `components/dashboard`, `components/exercises`, `components/add-pr`, `components/nav` hold page-specific composition. `components/atoms` holds small shared primitives (`Card`, `Pill`, `IconButton`, `Input`). `components/ui` is shadcn-generated (`components.json`, style `base-luma`) — treat it as vendor code and prefer composing over hand-editing it.
- **Styling**: Tailwind v4. Color classes like `bg-primary-background`, `text-secondary-text`, `text-accent-text` are custom CSS variable tokens defined in `app/globals.css`, not stock Tailwind palette names — check there before assuming a class exists.
- **Routing** is App Router only, three routes total: `/` (dashboard), `/exercises` (catalog list/search), `/exercises/[id]` (the add/edit-PR form for one exercise).
- Because this ships as a static export (`output: "export"`, `images.unoptimized: true`) running inside Capacitor's WebView with no live server, avoid server-only Next.js features that need a running server (API routes, server actions, middleware).
