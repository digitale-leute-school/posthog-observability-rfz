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

**The quickest way:** click **Claude prompt** on your team's card in the slides and paste it into Claude Code. It connects the PostHog MCP if needed, knows your team's context and notebook, builds the charts and drafts an answer under each question, in plain words.

Check every chart and answer yourselves before the check-in. You present it, not the agent.

## Your team

**Words you'll see in PostHog:** *Funnel*: how many people get from one step to the next. *Trends*: a count of people or events, often over time. *Breakdown*: the same chart split into one line per value (for example per browser). *Retention*: how many people come back on later days. *Insight*: a saved chart.

### Group 1 — Growth: the two A/B tests

**What changed since last Wednesday:**

- **The home button (23–29 Sept):** each visitor was randomly shown one of two versions of the main button on the home page, half and half: *"Book a visit"* or *"Talk to an advisor"*. It's the same button and leads to the same booking form. In PostHog this is the experiment *Home button copy* (feature flag `home-cta-copy`).
- **The booking layout (23–29 Sept):** everyone who opened the booking form was randomly shown one of two versions, half and half: the old form in 3 steps (service, then day, then time) or everything on one page. In PostHog this is the experiment *Booking layout* (feature flag `booking-layout`).

**The CEO asks:**

1. Which version did users prefer in each test, and by how much?
2. How sure are we? Is it a real difference, or could it be chance?
3. Do we ship A, B, a mix, or try something new?
4. What should we do next, and what would you measure to know it worked?

**Your notebook:** [LuOqP65I](https://eu.posthog.com/project/284869/notebooks/LuOqP65I). It lists the charts to build under each question.

### Group 2 — Product: the three new features

**What changed since last Wednesday:**

- Three new features went live on **Wed 23 Sept**. Each can be opened from a card on the home page or through the new search box on the home page.
- **Join a community event:** pick one of four Riverside events (street party, repair café, park clean-up, film night), choose how many guests you bring, then RSVP. Events: `event_rsvp_started` → `event_chosen` → `event_rsvp_completed`.
- **Book a bulky waste pickup:** choose the items to collect (sofa, mattress, fridge …), a pickup date 1 to 4 weeks ahead, and your street, then confirm. Events: `pickup_booking_started` → `pickup_items_chosen` → `pickup_date_chosen` → `pickup_booking_completed`.
- **Apply for a parking permit:** enter your number plate, choose a zone, add two documents, then submit. Events: `permit_application_started` → `permit_documents_added` → `permit_application_completed`.

**The CEO asks:**

1. Which feature did people use the most, and which the least?
2. Of those who start, how many finish?
3. Did you notice anything odd in any of the step-by-step charts?
4. What should we do next, and what would you measure to know it worked?

**Your notebook:** [CfqpB89w](https://eu.posthog.com/project/284869/notebooks/CfqpB89w). It lists the charts to build under each question.

### Group 3 — Quality: the redesigned report form

**What changed since last Wednesday:**

- The *Report an issue* form was redesigned and went live on **Mon 28 Sept at 09:00**.
- **Before:** you typed the location of the problem as text.
- **Now:** you place a pin on a map, or tap *Use my location*.
- Every report event carries `form_version`: `v1` is the old form, `v2` the new one. Events: `report_started` → `report_location_set` → `report_completed`.

**The CEO asks:**

1. Is the new form better or worse than the old one?
2. What exactly goes wrong, and for how many people?
3. How urgent is it? What do we fix first?
4. What should we do next, and what would you measure to know it worked?

**Your notebook:** [QgvzLUaF](https://eu.posthog.com/project/284869/notebooks/QgvzLUaF). It lists the charts to build under each question.

### Group 4 — Marketing: the Riverside launch

**What changed since last Wednesday:**

- On **Wed 23 Sept** Northstar started serving a new district, **Riverside**, and advertised it on three channels:
- **An Instagram ad (€600), our own newsletter (€0) and flyers with a QR code (€250).** Each campaign link carries a label saying where it came from (`utm_source`: `instagram`, `newsletter`, `flyer_qr`), so PostHog knows which channel brought each visitor. Visitors without a label came directly.
- **A short survey** popped up after someone completed any task: *How likely are you to recommend Northstar to a neighbour?* (0–10), and *What's the main reason for your score?* In PostHog it's the survey *Riverside NPS*.

**Campaign costs:** instagram €600 · newsletter €0 · flyer_qr €250

**The CEO asks:**

1. Which channel brought the most people, and which brought people who actually use the app and come back?
2. Do new users come back?
3. What are people saying about the app?
4. Where should the next campaign budget go?
5. What should we do next, and what would you measure to know it worked?

**Your notebook:** [yJ4uSc4W](https://eu.posthog.com/project/284869/notebooks/yJ4uSc4W). It lists the charts to build under each question.

## Your notebook

Your group's notebook already has a section per question and lists the charts to build there. Add each chart with `/` (Insight, Experiment, Survey, Error tracking issue, Recording) or with **Add to notebook** on anything you build in PostHog. Under each chart, write one sentence of answer. End with *What we'd do next* and the chart you'd watch to know it worked.

For the check-in, open the notebook full screen and walk through it from top to bottom. You have 5 minutes.
