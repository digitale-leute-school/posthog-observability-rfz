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
3. **One notebook per group,** with one section per question and the chart that proves it.
4. **Every group also answers:** *What should we do next, and what would you measure to know it worked?*

## Get into PostHog

You'll get an invite by email. Accept it, and you land in PostHog's **Default project**. That's the one with the exercise data. Create your group's notebook under **Notebooks → New notebook** and share the link with your group.

## Your team

### Group 1 — Growth: the two A/B tests

**The CEO asks:**
1. Which version did users prefer in each test, and by how much?
2. How sure are we? Is it significant, or could it be chance?
3. Do we ship A, B, a mix, or try something new?
4. What should we do next, and what would you measure to know it worked?

**Start with:** Experiments, feature flags, funnels broken down by flag variant.

### Group 2 — Product: the three new features

**The CEO asks:**
1. Which feature did people use the most, and which the least?
2. Of those who start, how many finish?
3. Did you notice anything odd in any of the funnels?
4. What should we do next, and what would you measure to know it worked?

**Start with:** Trends, funnels (step breakdowns, time to convert), breakdowns by event property, paths.

### Group 3 — Quality: the redesigned report form

**The CEO asks:**
1. Is the new form better or worse than the old one?
2. What exactly goes wrong, and for how many people?
3. How urgent is it? What do we fix first?
4. What should we do next, and what would you measure to know it worked?

**Start with:** Session replay, heatmaps (clicks, rage clicks, dead clicks), error tracking, a funnel broken down by `form_version`.

### Group 4 — Marketing: the Riverside launch

**The CEO asks:**
1. Which channel brought the most people, and which brought the best ones?
2. Do new users come back?
3. What are people saying about the app?
4. Where should the next campaign budget go?
5. What should we do next, and what would you measure to know it worked?

**Start with:** Web analytics (channels, UTM tags), retention, cohorts, surveys.

**Campaign costs** (by `utm_source`):

| Channel | Cost |
|---|---|
| `instagram` | €600 |
| `newsletter` | €0 (our own list) |
| `flyer_qr` | €250 |

## Notebook template

Copy this structure into your group's notebook. Add each chart with `/` → **Insight**, or with **Add to notebook** on any insight or replay.

```text
# Group <n> — <team>: <area>

## 1. <the CEO's first question>
[chart, replay or heatmap that proves it]
Answer: <one sentence>

## 2. <the next question>
[chart]
Answer: <one sentence>

…

## What we'd do next
<the change you'd make>
We'd know it worked if: <the metric, and the chart you'd watch>
```

For the check-in, open the notebook full screen and walk through it from top to bottom. You have 5 minutes.
