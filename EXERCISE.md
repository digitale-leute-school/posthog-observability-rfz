# Exercise: the CEO's weekly check-in

Slides for the session: [dl-posthog-rfz.vercel.app](https://dl-posthog-rfz.vercel.app) (the exercise is on the last slides).

## The scenario

You all work at **Northstar**, the startup behind the neighbourhood service-desk app. Since last Wednesday's check-in (23 Sept) we have:

- launched in a new district, **Riverside**,
- shipped **three new features**,
- run **two A/B tests**,
- redesigned the ***Report an issue*** form.

**The CEO arrives in 35 minutes** for the weekly check-in and wants each team to answer its questions with data.

The app is live at [posthog-rfz-exercise.vercel.app](https://posthog-rfz-exercise.vercel.app). Its data from the last week is already in PostHog.

## How it runs

| Step | What happens | Time |
|---|---|---|
| 1. Investigate | Your group answers its questions in PostHog. | 30 min |
| 2. Finish your notebook | One section per question, each with a chart and a one-sentence answer. | 7 min |
| 3. Check-in | Each group presents from its notebook to the CEO. | 4 × 5 min |

## Rules

1. **Only PostHog.** No code, and no looking at the source.
2. **Filter to the exercise app:** `posthog-rfz-exercise.vercel.app`. The project also holds the live demo's data, so without the filter your numbers are wrong. In most places, add a filter on the event's **Current URL** (or **Host**) containing `posthog-rfz-exercise`.
3. **One notebook per group,** with the charts listed for your group, each under its question with one sentence of answer.
4. **Every group also answers:** *What should we do next, and what would you measure to know it worked?*

## Get into PostHog

You'll get an invite by email. Accept it, and you land in PostHog's **Default project**. That's the one with the exercise data. Your group's notebook is ready: open it from the **Notebook** button on your team's card in the slides, or find it under **Notebooks**. The whole group can edit it at the same time.

**Try the app yourselves** at [posthog-rfz-exercise.vercel.app](https://posthog-rfz-exercise.vercel.app) to see the features your team is asked about. Your visits show up in PostHog too, which is fine.

### Optional: ask your AI agent (PostHog MCP)

The PostHog MCP lets Claude Code, Cursor and other AI agents query PostHog for you. You log in with your own PostHog account in the browser, so you don't need an API key.

```bash
npx @posthog/wizard mcp add        # detects your editor and sets it up
# or, for Claude Code only:
claude mcp add --transport http posthog https://mcp.posthog.com/mcp -s user
```

Then run `/mcp` in Claude Code (or restart your editor), sign in with the account from your invite, pick **Default project** and allow **write access**, so the agent can edit your notebook.

Then you can let it draft for you:

```text
Open our PostHog notebook <link>. For each question, build the charts listed there in PostHog,
filtered to posthog-rfz-exercise.vercel.app and 23–30 Sept, add them to the notebook under the
question, and write a one-sentence draft answer for each.
```

Check every chart and answer yourselves before the check-in. You present it, not the agent.

## Your team

### Group 1 — Growth: the two A/B tests

**The CEO asks:**
1. Which version did users prefer in each test, and by how much?
2. How sure are we? Is it significant, or could it be chance?
3. Do we ship A, B, a mix, or try something new?
4. What should we do next, and what would you measure to know it worked?

**Charts to build.** Put each one in your group's notebook under its question, with one sentence of answer:

- Q1: **Experiment: Home button copy.** Embed the experiment's results.
- Q1: **Experiment: Booking layout.** Embed the experiment's results.
- Q3: **Funnel:** `$pageview` → `booking_started` → `booking_completed`, broken down by `$feature/home-cta-copy`.
- Q3: **Funnel:** `booking_started` → `booking_completed`, broken down by `$feature/booking-layout`. Then try other breakdowns (device, browser, …) until you find the one that explains the result.

### Group 2 — Product: the three new features

**The CEO asks:**
1. Which feature did people use the most, and which the least?
2. Of those who start, how many finish?
3. Did you notice anything odd in any of the funnels?
4. What should we do next, and what would you measure to know it worked?

**Charts to build.** Put each one in your group's notebook under its question, with one sentence of answer:

- Q1: **Trends:** unique users of `event_rsvp_started`, `pickup_booking_started` and `permit_application_started`, shown as a bar chart (total value).
- Q2: **Three funnels,** one per feature, with every step: `event_rsvp_started` → `event_chosen` → `event_rsvp_completed`, `pickup_booking_started` → `pickup_items_chosen` → `pickup_date_chosen` → `pickup_booking_completed`, and `permit_application_started` → `permit_documents_added` → `permit_application_completed`.
- Q3: **The funnel with the odd step, broken down** by a property of that step's event (look at what people chose).
- Q3: **Trends:** the least-used feature's started event, broken down by `source`, to see how people find it.

### Group 3 — Quality: the redesigned report form

**The CEO asks:**
1. Is the new form better or worse than the old one?
2. What exactly goes wrong, and for how many people?
3. How urgent is it? What do we fix first?
4. What should we do next, and what would you measure to know it worked?

**Charts to build.** Put each one in your group's notebook under its question, with one sentence of answer:

- Q1: **Funnel:** `report_started` → `report_location_set` → `report_completed`, broken down by `form_version` (`v1` old, `v2` new).
- Q2: **Error tracking issue:** embed the issue that appears on the new form.
- Q2: **Heatmap:** in *Heatmaps → New*, set the page to screenshot to `https://posthog-rfz-exercise.vercel.app/?view=report` and the heatmap data URL to `https://posthog-rfz-exercise.vercel.app/` (the app keeps one URL, so every click is recorded there). Look at clicks, rage clicks and dead clicks on the map, and add a screenshot or link.
- Q2: **Two recordings:** find replays of people who started a report but didn't send it, and embed the two that show the problems best.
- Q2: **Funnel:** the `v2` funnel from above, broken down by `$browser`.

### Group 4 — Marketing: the Riverside launch

**The CEO asks:**
1. Which channel brought the most people, and which brought the best ones?
2. Do new users come back?
3. What are people saying about the app?
4. Where should the next campaign budget go?
5. What should we do next, and what would you measure to know it worked?

**Charts to build.** Put each one in your group's notebook under its question, with one sentence of answer:

- Q1: **Trends:** unique users, broken down by the person property `Initial UTM source`, as a bar chart (total value).
- Q1: **Funnel:** `$pageview` → any `…_completed` event (add them as one step with *OR*), broken down by `Initial UTM source`.
- Q2: **Retention:** first `$pageview` → any later `$pageview`, daily, broken down by `Initial UTM source`.
- Q3: **Survey: Riverside NPS.** Embed its results and quote two or three typical comments.
- Q4: **Table (as text):** per channel, the cost, the people who came back, and the cost per returning person.

**Campaign costs** (by `utm_source`):

| Channel | Cost |
|---|---|
| `instagram` | €600 |
| `newsletter` | €0 (our own list) |
| `flyer_qr` | €250 |

## Your notebook

Your group's notebook already has a section per question and lists the charts to build there. Add each chart with `/` (Insight, Experiment, Survey, Error tracking issue, Recording) or with **Add to notebook** on anything you build in PostHog. Under each chart, write one sentence of answer. End with *What we'd do next* and the chart you'd watch to know it worked.

For the check-in, open the notebook full screen and walk through it from top to bottom. You have 5 minutes.
