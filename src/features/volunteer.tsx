"use client";

import { HeartHandshake } from "lucide-react";
import { journeyEvent } from "@/lib/analytics";
import { PageHead } from "@/components/page-parts";
import type { Feature, FeatureScreenProps } from "./types";

/*
 * Group 4: Sign up to volunteer
 *
 * The journey: Choose a project (food bank, tree planting, reading buddies), pick a shift from a small calendar, and confirm the sign-up.
 *
 * Your checklist (see EXERCISE.md):
 * 1. Build the screens below, using the same classes as the rest of the app
 *    (form-card surface, choice, primary-button, …) and the shared PageHead / SuccessHead.
 * 2. Events: "volunteer_signup_started" is sent for you when someone clicks your card.
 *    Send journeyEvent("volunteer_signup_completed", { … }) when the journey is done, plus any
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
        <button className="primary-button" onClick={() => journeyEvent("volunteer_signup_completed")}>{lang === "de" ? "Beispiel-Button" : "Example button"}</button>
      </section>
    </>
  );
}

export const feature: Feature = {
  id: "volunteer",
  ready: false,
  icon: HeartHandshake,
  tone: "lilac",
  title: { en: "Sign up to volunteer", de: "Ehrenamtlich mithelfen" },
  description: { en: "Pick a local project and a shift that suits you.", de: "Such dir ein Projekt und eine passende Schicht aus." },
  events: { started: "volunteer_signup_started", completed: "volunteer_signup_completed" },
  Screen,
};
