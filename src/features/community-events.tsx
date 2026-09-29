"use client";

import { CalendarHeart } from "lucide-react";
import { journeyEvent } from "@/lib/analytics";
import { PageHead } from "@/components/page-parts";
import type { Feature, FeatureScreenProps } from "./types";

/*
 * Group 1: Join a community event
 *
 * The journey: Browse upcoming events (a street party, a repair café, a clean-up), open one, choose how many people are coming, and confirm the RSVP.
 *
 * Your checklist (see EXERCISE.md):
 * 1. Build the screens below, using the same classes as the rest of the app
 *    (form-card surface, choice, primary-button, …) and the shared PageHead / SuccessHead.
 * 2. Events: "event_rsvp_started" is sent for you when someone clicks your card.
 *    Send journeyEvent("event_rsvp_completed", { … }) when the journey is done, plus any
 *    step events that help you find where people drop off.
 * 3. Plant ONE secret bug that throws a JavaScript error. A normal user should hit it
 *    for some of their choices, without an error message on screen. See EXERCISE.md.
 * 4. Set ready: true, then open a pull request.
 */
function Screen({ lang, onBack }: FeatureScreenProps) {
  const t = feature.title[lang];
  return (
    <>
      <PageHead back={onBack} backText={lang === "de" ? "Zurück" : "Back"} eyebrow={lang === "de" ? "BALD VERFÜGBAR" : "COMING SOON"} title={t} sub={feature.description[lang]} />
      <section className="form-card surface">
        <button className="primary-button" onClick={() => journeyEvent("event_rsvp_completed")}>{lang === "de" ? "Beispiel-Button" : "Example button"}</button>
      </section>
    </>
  );
}

export const feature: Feature = {
  id: "community-events",
  ready: false,
  icon: CalendarHeart,
  tone: "mint",
  title: { en: "Join a community event", de: "An einer Nachbarschaftsaktion teilnehmen" },
  description: { en: "See what’s on nearby and save your spot.", de: "Sieh, was in der Nähe los ist, und sichere dir einen Platz." },
  events: { started: "event_rsvp_started", completed: "event_rsvp_completed" },
  Screen,
};
