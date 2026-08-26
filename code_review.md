# Code Review — pr-calculator

**Scope:** Full repository review (all source files under `api/`, `app/`, `components/`, `context/`, `lib/`, plus config: `next.config.ts`, `capacitor.config.ts`, `tsconfig.json`), not limited to the current diff.
**Branch:** `feature/add-claude` (built on `feature/convert-to-mobile`)
**Level:** high (recall-biased)
**Method:** manual line-by-line read of every source file (~2,600 LOC across 35 files), cross-file tracing of shared state/helpers, and a real `next build` run to verify the static-export finding.

Findings are ordered most-severe first. Severity reflects real-world impact (crash/build failure > data corruption > UX defect > dead code/cleanup).

---

## 1. [Critical] Production build fails: dynamic route incompatible with static export

**File:** `app/exercises/[id]/page.tsx` (interacts with `next.config.ts:4`)

`next.config.ts` sets `output: "export"`, which requires every dynamic route segment to declare `generateStaticParams()` so Next knows which paths to pre-render. `app/exercises/[id]/page.tsx` has no `generateStaticParams()`.

Verified by actually running the build:

```
Error: Page "/exercises/[id]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.
```

**Impact:** `next build` (and therefore `npx cap sync`, which depends on the `out/` folder existing) fails outright. The entire Add/Edit-PR flow — the core feature of the app — cannot ship in the static-export/Capacitor build at all today.

**Fix:** Add a `generateStaticParams()` to `app/exercises/[id]/page.tsx` (e.g. fetch the full exercise ID list at build time from `oss.exercisedb.dev` and return `{ id }` for each), or set `dynamicParams` appropriately and pre-render a bounded set of IDs. If the exercise catalog is too large/volatile to enumerate at build time, the architecture needs to change (e.g., pass exercise data via query string/client-side navigation state instead of a dynamic route segment) since static export cannot serve arbitrary un-enumerated paths.

---

## 2. [Critical] Capacitor config points production app at a dev server (self-documented known issue)

**File:** `capacitor.config.ts:7-9`

```ts
server: {
    url: "http://localhost:3000",
},
```

When `server.url` is set, Capacitor loads the WebView content from that URL instead of the bundled `webDir: "out"` files. On a real device/emulator there is no server running at `localhost:3000`, so the packaged app will show a blank screen or network error instead of the app.

This is already called out as unresolved in the repo's own `CLAUDE.md`:
> "`capacitor.config.ts` currently sets `server.url` to `http://localhost:3000` for dev live-reload; ... this needs to be removed/changed for a real production build."

**Impact:** Any production/release build of the Android or iOS app is currently non-functional.

**Fix:** Remove the `server` block (or gate it behind an env var / separate dev config) before producing a release build, so the app loads from the bundled static export.

---

## 3. [High] Home screen "Progress" widget re-randomizes on every render

**File:** `components/dashboard/ProgressSection.tsx:11-16`

```tsx
const { prs } = usePrState();
const exercise = getRandomRecord();
...
function getRandomRecord() {
    return prs[Math.floor(Math.random() * prs.length)];
}
```

`getRandomRecord()` runs directly in the render body with no `useMemo`/`useEffect`/seed tied to `prs`. `ProgressSection` sits under `PrStateProvider`, which wraps the entire app (`app/layout.tsx`), so **any** state update anywhere in the tree (navigating back to `/`, saving a PR, etc.) re-renders `ProgressSection` and picks a brand-new random exercise.

**Failure scenario:** User has 3 PRs saved. They open the dashboard and see "Bench Press Progress: 80%". Any subsequent re-render (e.g., after the toast/confetti timer fires, or React Strict Mode double-invokes in dev) can silently swap the displayed exercise to "Squat Progress: 40%" with no user interaction — confusing and makes the widget feel broken/flickery.

**Fix:** Pick the random record once per mount (e.g. `useMemo(() => prs[...], [])` with an empty dep array, or `useState(() => ...)` initializer), or make the selection deterministic (e.g., most-recently-updated PR) rather than random-per-render.

---

## 4. [Medium] PR form validation only rejects exactly `0`, not negative numbers

**File:** `components/add-pr/PrFormSection.tsx:76-81`

```ts
if (
    formInputs.weight === 0 ||
    formInputs.reps === 0 ||
    formInputs.goal === 0
)
    throw new Error("Please fill in all fields");
```

The `+`/`-` buttons in `InputCard` (`components/add-pr/InputCard.tsx:24`) clamp decrements with `Math.max(0, ...)`, but the number `<input>` itself (`InputCard.tsx:47-59`, `onChange: (e) => setValue(Number(e.target.value))`) has no `min` attribute and no lower-bound check. A user typing directly into the field (e.g. `-50`) produces a negative `formInputs.weight`, which is **not** `=== 0`, so it passes validation.

**Failure scenario:** User types `-50` into "Weight Lifted", `5` into reps, `100` into goal, and saves. A PR record with `currentPR: -50` is persisted to `localStorage`, `getOneRepMax(-50, 5)` computes a negative "1RM", and the dashboard displays a negative weight/percentage.

**Fix:** Validate `<= 0` (or add `min={0}` to the underlying `<input type="number">` and still validate server/state-side, since `min` alone doesn't block manual entry in all browsers).

---

## 5. [Medium] Duplicate `id="inline-start-input"` whenever more than one `Input` renders on a page

**File:** `components/atoms/Input.tsx:28`

```tsx
<InputGroupInput
    id="inline-start-input"
    placeholder={placeholder || "Search..."}
    {...props}
/>
```

The `id` is hardcoded rather than generated per-instance (e.g. via `React.useId()`) or accepted as a prop. `PrFormSection.tsx` renders three `InputCard`s simultaneously (Weight, Reps, Goal), each wrapping an `Input`, so the Add-PR page ends up with three DOM elements sharing `id="inline-start-input"`.

**Impact:** Invalid HTML (duplicate IDs), breaks any future `label htmlFor="inline-start-input"` association, `document.getElementById` lookups, and browser autofill/accessibility tooling that key off unique element IDs.

**Fix:** Generate the id with `React.useId()` inside `Input`, or accept an `id` prop from the caller.

---

## 6. [Medium] Radial chart's polar-axis domain degenerates to `[0, 0]` before a goal is set

**File:** `components/dashboard/RadialProgressChart.tsx:57`

```tsx
<PolarAngleAxis type="number" domain={[0, goal || 0]} tick={false} />
```

When `goal` is `0`, `null`, or `undefined` — the normal state before the user has saved any PR with a goal, and explicitly anticipated elsewhere in this same file (`goal ? \`Goal: ${goal}kg\` : "No goal set"`) — the domain collapses to `[0, 0]`. A zero-width numeric domain is a degenerate input for Recharts' `PolarAngleAxis`/`RadialBar` scale and can render the bar as fully filled, fully empty, or emit console warnings, inconsistent with the "No goal set" label shown alongside it.

**Fix:** Fall back to a sensible non-zero domain when there's no goal, e.g. `domain={[0, goal || 100]}` or `domain={[0, goal || currentPR || 1]}`, mirroring the same `goal` fallback logic already used for the text label.

---

## 7. [Low] Dead/unused constants contradict the project's own documentation

**File:** `lib/constants.ts:3-57`

`PR_EXERCISES` (five duplicate placeholder "Flat Bench Press" records) and `CATEGORIES` are exported but never imported anywhere in the app (verified via repo-wide search). Notably, `CLAUDE.md` states:

> "`CATEGORIES` there drives the body-part filter pills on `/exercises`."

but the actual filter pills in `components/exercises/ExerciseSection.tsx:25-30` are built from the `bodyParts` prop (sourced from the live `getBodyParts()` API call), not from `CATEGORIES`. The docs and code have drifted, and `PR_EXERCISES`/`CATEGORIES` are dead weight.

**Fix:** Either wire `CATEGORIES` into the filter pills (if that was the intent) or delete both exports and correct the `CLAUDE.md` description.

---

## 8. [Low] Duplicated confetti-at-click-position logic instead of reusing the existing component

**Files:** `components/add-pr/PrFormSection.tsx:128-136` vs. `components/ui/confetti.tsx:117-139`

`PrFormSection.savePR` re-implements, inline, the exact "compute click position as a fraction of `window.innerWidth`/`innerHeight` and fire confetti from there" logic that already exists as a ready-to-use component: `ConfettiButton` in `components/ui/confetti.tsx`. Meanwhile `components/atoms/ConfettiButton.tsx` — clearly intended as the wrapper to use — is left as 100% commented-out dead code.

**Fix:** Either finish wiring `components/atoms/ConfettiButton.tsx` (uncomment it) and use it in `PrFormSection`, or delete the dead file and call `components/ui/confetti.tsx`'s `ConfettiButton` directly, removing the duplicated inline calculation.

---

## 9. [Low] Infinite-scroll `IntersectionObserver` is torn down/recreated on every keystroke

**File:** `components/exercises/ExerciseList.tsx:37-77`

`handleIntersect` is a `useCallback` with `[searchTerm, selectedFilter, setExerciseData]` as dependencies. The `useEffect` that constructs the `IntersectionObserver` depends on `handleIntersect` (line 77), so every character typed into the search box (`searchTerm` changes on each keystroke in `ExerciseSection.tsx:61`) disconnects and reconstructs the observer, even though the observer's target/root never change.

**Fix:** Keep `searchTerm`/`selectedFilter` in refs updated by a separate `useEffect`, and give `handleIntersect` (and the observer-creation effect) a stable identity so the `IntersectionObserver` is created once and only reconnected when `sentinelRef`/`containerRef` actually change.

---

## Summary / prioritized action list

| # | Priority | File | Action |
|---|----------|------|--------|
| 1 | Critical | `app/exercises/[id]/page.tsx` | Add `generateStaticParams()` (or redesign the route) so `next build` succeeds under `output: "export"` |
| 2 | Critical | `capacitor.config.ts` | Remove/guard `server.url` before any production mobile build |
| 3 | High | `components/dashboard/ProgressSection.tsx` | Memoize/stabilize the random PR selection so it doesn't change on unrelated re-renders |
| 4 | Medium | `components/add-pr/PrFormSection.tsx` | Reject negative (not just zero) weight/reps/goal values |
| 5 | Medium | `components/atoms/Input.tsx` | Replace hardcoded `id="inline-start-input"` with `React.useId()` |
| 6 | Medium | `components/dashboard/RadialProgressChart.tsx` | Fix degenerate `[0,0]` domain when no goal is set |
| 7 | Low | `lib/constants.ts` | Remove or wire up dead `PR_EXERCISES`/`CATEGORIES`; fix stale `CLAUDE.md` claim |
| 8 | Low | `components/add-pr/PrFormSection.tsx`, `components/atoms/ConfettiButton.tsx` | De-duplicate confetti-origin logic; delete or finish the dead wrapper |
| 9 | Low | `components/exercises/ExerciseList.tsx` | Stabilize `handleIntersect` so the scroll observer isn't rebuilt per keystroke |
