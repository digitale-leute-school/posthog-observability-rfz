# Northstar Neighborhood Service Desk

> **Live demo repo** for the *PostHog for Product Observability* session. It runs at [northstar-live-demo.vercel.app](https://northstar-live-demo.vercel.app) and deploys automatically from `main`. The booking screen's afternoon slots contain a deliberate bug. **Slides:** [dl-posthog-rfz.vercel.app](https://dl-posthog-rfz.vercel.app). **Exercise:** *The CEO's weekly check-in*. Groups answer the CEO's questions about the exercise app at [posthog-rfz-exercise.vercel.app](https://posthog-rfz-exercise.vercel.app) using only PostHog. The brief is in [EXERCISE.md](EXERCISE.md).

A small Next.js demo for the Observability & Monitoring collab. It runs without accounts, a database, API keys, email, OAuth, or a hosted backend. Reports and appointments are stored in the visitor's browser so anyone can complete a task immediately.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run build` to check the production build.

## Three ready-to-use tasks

| Task for the other group | Starting point | Completed when |
| --- | --- | --- |
| Report a broken streetlight | **Report an issue** | A new `NS-…` reference appears |
| Check an existing streetlight report | **Track a report**; reference `NS-1042` is already filled in | The status and timeline appear |
| Book a visit about housing advice | **Book a visit** | An `AP-…` confirmation appears |

The seeded report `NS-1042` is always available. The **Reset demo** action clears new reports and bookings on that browser only. None of the flows requires a real name, email address, or payment.

The top-right **EN / DE** toggle switches the complete interface between English and German. The journey event names and saved demo data remain stable when the language changes.

## Set up PostHog and Vercel

**With Claude Code:** paste the setup prompt from [GUIDE.md](GUIDE.md#quick-setup-with-claude-code) into Claude Code, and it does the steps below for you.

**By hand:**

1. **Create your repo:** click **Use this template → Create a new repository**, then clone it and run `npm install`.
2. **Add PostHog:** sign up at [eu.posthog.com/signup](https://eu.posthog.com/signup) (EU cloud, free). Copy your project token from **Settings → Project → Project token**, then run `cp .env.example .env.local` and paste the token after `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=`. Check that **Settings → Session replay → Record user sessions** is on.
3. **Check it locally:** run `npm run dev`, complete a task, and look under **Activity** and **Session replay** in PostHog. New events can take a few minutes to appear.
4. **Deploy on Vercel:** at [vercel.com/new](https://vercel.com/new), import your repo, keep the Next.js preset, and paste your token into the `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` environment variable. Skip the optional PostHog integration, then click **Deploy**.

No code changes are needed. For the rest of the exercise (swapping tasks, the agent report, and the replay), follow [GUIDE.md](GUIDE.md).

## PostHog

PostHog is already wired in and stays off until you set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (copy `.env.example` to `.env.local` locally, and add the same variable in Vercel). [`instrumentation-client.ts`](instrumentation-client.ts) starts PostHog with autocapture and session replay, and [`next.config.ts`](next.config.ts) routes its traffic through the app's `/ingest` path so ad blockers rarely block it. [`src/lib/analytics.ts`](src/lib/analytics.ts) sends each task's start and finish event with a timestamped `replay_url`. The six task events are:

| Flow | Start | Finish |
| --- | --- | --- |
| Report an issue | `report_started` | `report_completed` |
| Track a report | `tracking_started` | `tracking_completed` |
| Book a visit | `booking_started` | `booking_completed` |

The app sends no personal data by itself. Inputs are masked in replays by default. Use invented details, and review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) before recording real users.
