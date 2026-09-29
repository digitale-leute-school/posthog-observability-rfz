# Exercise: add a feature to Northstar

Each group adds **one new user journey** to the Northstar demo app, with PostHog events and **one secret bug**, and opens a pull request. When it's merged, it deploys automatically to [northstar-live-demo.vercel.app](https://northstar-live-demo.vercel.app). Then another group uses your feature, and a third group tries to find your bug using only PostHog.

## How it runs

| Round | What happens | Time |
|---|---|---|
| 1. Build | Each group builds its feature with one secret bug and opens a pull request. | 20 min |
| 2. Merge | I approve and merge every pull request. Vercel deploys `main`. | 5 min |
| 3. Test | You use the **next** group's feature like a normal user: group 1 → feature 2, 2 → 3, 3 → 4, 4 → 1. | 5 min |
| 4. Analyse | You find the bug in the feature **two groups on**, using only PostHog: group 1 → feature 3, 2 → 4, 3 → 1, 4 → 2. | 10 min |
| 5. Reveal | Each analysing group names the bug it found. The builders say whether it's right. | 5 min |

In round 4 you don't open the code or ask the builders. Use funnels, session replays, heatmaps and error tracking in PostHog.

## Your feature

| Group | Feature | Issue | Your file | Events |
|---|---|---|---|---|
| 1 | Join a community event | [#1](https://github.com/digitale-leute-school/posthog-observability-rfz/issues/1) | `src/features/community-events.tsx` | `event_rsvp_started` → `event_rsvp_completed` |
| 2 | Book a bulky waste pickup | [#2](https://github.com/digitale-leute-school/posthog-observability-rfz/issues/2) | `src/features/bulky-pickup.tsx` | `pickup_booking_started` → `pickup_booking_completed` |
| 3 | Apply for a parking permit | [#3](https://github.com/digitale-leute-school/posthog-observability-rfz/issues/3) | `src/features/parking-permit.tsx` | `permit_application_started` → `permit_application_completed` |
| 4 | Sign up to volunteer | [#4](https://github.com/digitale-leute-school/posthog-observability-rfz/issues/4) | `src/features/volunteer.tsx` | `volunteer_signup_started` → `volunteer_signup_completed` |

The comment at the top of your file describes the journey. Each feature gets its own card on the landing page, next to *Report an issue*, *Track a report* and *Book a visit*.

## Rules

1. **Only change your own file** (plus new files of your own, if you need them). The landing page picks your feature up automatically, so groups don't get merge conflicts.
2. **Events:** the `…_started` event is sent for you when someone clicks your card. Send `…_completed` yourself with `journeyEvent()` from `@/lib/analytics` when the journey is done. Add step events if they help you see where people drop off, e.g. `pickup_date_chosen`. Name events after what the user did, in past tense, and put details in properties.
3. **Plant one secret bug** that throws a JavaScript error, like the afternoon time slots in *Book a visit*:
   - **Easy to hit:** a normal user following the journey runs into it for some of their choices (a certain option, date or amount), not only on the tenth try or with a strange input. The testers only have 5 minutes.
   - **Not given away by the UI:** no error message on screen. The journey just doesn't work.
   - **Secret:** don't tell the other groups. The analysing group has to find it through PostHog.
4. **No personal data in events:** no names, emails or addresses in event properties.
5. Set `ready: true` in your file when it works.

## Steps

You have write access through the `batch-07-26` team, so you work in this repo directly. `main` only changes through a pull request that I approve.

```bash
git clone https://github.com/digitale-leute-school/posthog-observability-rfz.git
cd posthog-observability-rfz
npm install
npm run dev          # http://localhost:3000
```

Build your feature, then check it locally: your card appears on the landing page, the journey works, and `npm run build` passes. Locally no events are sent to PostHog; that starts after the merge.

```bash
git checkout -b group-1-community-events
git add -A && git commit -m "Add community events journey"
git push -u origin HEAD   # push your branch, never main
gh pr create --base main --fill   # write "Closes #<your issue>" in the description
```

A coding agent such as Claude Code is welcome. Point it at this file and your feature file.

## After the merge

- Your feature is live on [northstar-live-demo.vercel.app](https://northstar-live-demo.vercel.app).
- `/?view=<your feature id>` opens your feature directly (e.g. `/?view=bulky-pickup`). We use it for your heatmap.
- The next group tests your feature (round 3), then the group after that looks for your bug in PostHog (round 4). See [How it runs](#how-it-runs).
