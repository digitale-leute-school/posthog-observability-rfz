// Plays ~15 scripted testers against the deployed live-demo app, so PostHog records
// real events, replays, heatmaps, rage clicks, errors and survey answers.
//
//   node demo/testers.mjs                 # all testers
//   node demo/testers.mjs --only 1        # just the first tester (smoke test)
//   DEMO_URL=http://localhost:3000 node demo/testers.mjs
//
// Every tester gets a fresh browser profile, so PostHog counts each one as a new visitor.
import { chromium } from "playwright";

const URL = process.env.DEMO_URL ?? "https://northstar-live-demo.vercel.app";
const CONCURRENCY = 3;

const agents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0",
];
const screens = [
  { width: 1280, height: 800 }, { width: 1440, height: 900 },
  { width: 1536, height: 864 }, { width: 1920, height: 1080 },
];

// The run plan from the live demo spec: 7 reports/tracking (all succeed),
// 4 bookings that succeed on a morning slot, 4 that give up on a broken afternoon slot.
const testers = [
  { task: "report", place: "Linden Avenue, by the bus stop", note: "The streetlight flickers and goes out after dark." },
  { task: "book-ok", service: "Housing advice", day: "Tomorrow", tryAfternoon: false },
  { task: "book-fail", service: "Housing advice", day: "Tomorrow", afternoon: "14:00", feedback: "I can't select an afternoon time. 14:00 just doesn't react when I click it." },
  { task: "track" },
  { task: "report", place: "Maple Street, near number 30", note: "Streetlight at the corner has been off for three nights." },
  { task: "book-fail", service: "Permits and forms", day: "Next day", afternoon: "16:30", feedback: "I can't select an afternoon time. 16:30 just doesn't react when I click it." },
  { task: "book-ok", service: "General help", day: "Next day", tryAfternoon: true },
  { task: "report", place: "Oak Lane, opposite the school", note: "The lamp post light is completely dark." },
  { task: "book-fail", service: "Housing advice", day: "Next day", afternoon: "16:30", feedback: "Afternoon slots are broken, I work mornings so I couldn't book." },
  { task: "track" },
  { task: "book-ok", service: "Permits and forms", day: "Tomorrow", tryAfternoon: true },
  { task: "report", place: "Birch Road, near the playground", note: "One streetlight is out, the path is very dark." },
  { task: "book-fail", service: "General help", day: "Tomorrow", afternoon: "14:00", feedback: null },
  { task: "report", place: "Elm Court, entrance to the car park", note: "Streetlight keeps switching on and off." },
  { task: "book-ok", service: "Housing advice", day: "Next day", tryAfternoon: false },
  // Added after the first run, whose survey answers didn't get submitted.
  { task: "book-fail", service: "Housing advice", day: "Tomorrow", afternoon: "14:00", feedback: "I can't select an afternoon time. 14:00 just doesn't react when I click it." },
  { task: "book-fail", service: "General help", day: "Next day", afternoon: "16:30", feedback: "Afternoon slots are broken, I work mornings so I couldn't book." },
  { task: "book-ok", service: "Permits and forms", day: "Next day", tryAfternoon: true },
  { task: "book-fail", service: "Permits and forms", day: "Tomorrow", afternoon: "14:00", feedback: "Clicking 14:00 does nothing. Is the afternoon fully booked? It doesn't say." },
  { task: "book-ok", service: "General help", day: "Tomorrow", tryAfternoon: false },
];

const rand = (min, max) => min + Math.random() * (max - min);
const pause = (page, min = 700, max = 1800) => page.waitForTimeout(rand(min, max));

// Move the mouse to an element in visible steps, then click, like a person would.
async function humanClick(page, locator, { settle = true } = {}) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  const x = box.x + box.width * rand(0.3, 0.7);
  const y = box.y + box.height * rand(0.3, 0.7);
  await page.mouse.move(x, y, { steps: Math.round(rand(12, 28)) });
  if (settle) await pause(page, 150, 450);
  await page.mouse.click(x, y);
  return { x, y };
}

async function humanType(page, locator, text) {
  await humanClick(page, locator);
  await locator.pressSequentially(text, { delay: rand(55, 120) });
}

// Click the same spot several times fast: PostHog records this as a rage click.
async function rageClick(page, locator) {
  const { x, y } = await humanClick(page, locator);
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(rand(110, 190));
    await page.mouse.click(x + rand(-3, 3), y + rand(-3, 3));
  }
}

async function wanderHome(page) {
  await pause(page, 1500, 3000);
  await page.mouse.move(rand(300, 900), rand(200, 500), { steps: 20 });
  await pause(page);
}

async function report(page, t) {
  await humanClick(page, page.getByRole("button", { name: /Report an issue/ }));
  await pause(page);
  await humanClick(page, page.getByRole("button", { name: "Streetlight" }));
  await humanType(page, page.locator("#report-location"), t.place);
  await pause(page);
  await humanType(page, page.locator("#report-details"), t.note);
  await pause(page);
  await humanClick(page, page.getByRole("button", { name: /Review report/ }));
  await pause(page, 1500, 2500);
  await humanClick(page, page.getByRole("button", { name: /Send report/ }));
  await page.getByText("Report sent.").waitFor();
  await pause(page, 1500, 2500);
}

async function track(page) {
  await humanClick(page, page.getByRole("button", { name: /Track a report/ }));
  await pause(page, 1200, 2200);
  await humanClick(page, page.getByRole("button", { name: /Find report/ }));
  await page.getByText("Here's the latest.").waitFor();
  await pause(page, 2500, 4000);
}

async function openBooking(page, t) {
  await humanClick(page, page.getByRole("button", { name: /Book a visit/ }));
  await pause(page, 1200, 2000);
  await humanClick(page, page.locator("#service"));
  await page.locator("#service").selectOption(t.service);
  await pause(page);
  await humanClick(page, page.getByRole("button", { name: new RegExp(t.day) }));
  await pause(page);
}

const slot = (page, time) => page.getByRole("button", { name: time });
const morning = { Tomorrow: "09:30", "Next day": "10:15" };
const afternoon = { Tomorrow: "14:00", "Next day": "16:30" };

async function bookOk(page, t) {
  await openBooking(page, t);
  if (t.tryAfternoon) {
    await humanClick(page, slot(page, afternoon[t.day]));
    await pause(page, 1200, 2000);
  }
  await humanClick(page, slot(page, morning[t.day]));
  await pause(page);
  await humanClick(page, page.getByRole("button", { name: /Confirm visit/ }));
  await page.getByText("You're booked.").waitFor();
  await pause(page, 1500, 2500);
}

async function bookFail(page, t) {
  await openBooking(page, t);
  await humanClick(page, slot(page, t.afternoon));
  await pause(page, 1500, 2500);
  await rageClick(page, slot(page, t.afternoon));
  await pause(page, 1500, 2500);
  await humanClick(page, page.getByRole("button", { name: /Confirm visit/ }));
  await pause(page, 2000, 3000);
  // Try the other day's afternoon slot too, then the first one once more.
  const otherDay = t.day === "Tomorrow" ? "Next day" : "Tomorrow";
  await humanClick(page, page.getByRole("button", { name: new RegExp(otherDay) }));
  await pause(page);
  await rageClick(page, slot(page, afternoon[otherDay]));
  await pause(page, 2000, 3500);

  // The feedback survey pops up as soon as an error ($exception) is captured.
  const surveyText = page.getByText("Is anything stopping you from booking a visit?");
  try {
    await surveyText.waitFor({ timeout: 40000 });
    await pause(page, 1200, 2000);
    if (t.feedback) {
      // The survey is in a shadow root and animates in, so click its fields directly.
      const answer = page.locator("#surveyQuestion0");
      await answer.click({ force: true });
      await answer.pressSequentially(t.feedback, { delay: rand(55, 120) });
      await pause(page);
      await page.locator('button[aria-label="Submit survey"]').click({ force: true });
    } else {
      await page.locator('button[aria-label="Close survey"]').click({ force: true });
    }
  } catch (e) {
    console.log(`  survey step failed: ${e.message.split("\n")[0]}`);
    if (process.env.DEBUG_SURVEY) {
      await page.screenshot({ path: process.env.DEBUG_SURVEY });
      console.log(await page.evaluate(() => [...document.querySelectorAll("div")].filter((d) => d.shadowRoot).map((d) => d.className + " :: " + d.shadowRoot.innerHTML.slice(0, 1500)).join("\n")));
    }
  }
  await pause(page, 2000, 3000);
}

const tasks = { report, track, "book-ok": bookOk, "book-fail": bookFail };

async function runTester(browser, t, i) {
  const context = await browser.newContext({
    userAgent: agents[i % agents.length],
    viewport: screens[i % screens.length],
    locale: "en-GB",
    timezoneId: "Europe/Berlin",
  });
  // Headless Chromium reports a "HeadlessChrome" brand, which PostHog drops as a bot.
  const agent = agents[i % agents.length];
  await context.addInitScript(({ edge, windows }) => {
    const brands = [
      { brand: edge ? "Microsoft Edge" : "Google Chrome", version: "140" },
      { brand: "Chromium", version: "140" }, { brand: "Not=A?Brand", version: "24" },
    ];
    Object.defineProperty(Navigator.prototype, "userAgentData", {
      get: () => ({ brands, mobile: false, platform: windows ? "Windows" : "macOS", getHighEntropyValues: async () => ({ brands, mobile: false }) }),
    });
  }, { edge: agent.includes("Edg/"), windows: agent.includes("Windows") });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await page.goto(URL, { waitUntil: "networkidle" });
    await wanderHome(page);
    await tasks[t.task](page, t);
    // Give PostHog time to send the last events and replay chunks before leaving.
    await page.waitForTimeout(8000);
    console.log(`tester ${i + 1} (${t.task}) done${errors.length ? `, ${errors.length} page errors` : ""}`);
  } catch (e) {
    console.log(`tester ${i + 1} (${t.task}) FAILED: ${e.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
}

const onlyIndex = process.argv.indexOf("--only");
const selected = onlyIndex > -1
  ? process.argv[onlyIndex + 1].split(",").map((n) => [testers[Number(n) - 1], Number(n) - 1])
  : testers.map((t, i) => [t, i]);

const browser = await chromium.launch({ headless: true, args: ["--disable-blink-features=AutomationControlled"] });
const queue = [...selected];
await Promise.all(Array.from({ length: CONCURRENCY }, async (_, worker) => {
  await new Promise((r) => setTimeout(r, worker * rand(8000, 15000)));
  while (queue.length) {
    const [t, i] = queue.shift();
    await runTester(browser, t, i);
    await new Promise((r) => setTimeout(r, rand(3000, 12000)));
  }
}));
await browser.close();
