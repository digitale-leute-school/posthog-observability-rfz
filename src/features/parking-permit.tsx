"use client";

import { Car } from "lucide-react";
import { journeyEvent } from "@/lib/analytics";
import { PageHead } from "@/components/page-parts";
import type { Feature, FeatureScreenProps } from "./types";

/*
 * Group 3: Apply for a parking permit
 *
 * The journey: A multi-step form: vehicle details, address and parking zone, permit length, then a summary with a price and a submit button.
 *
 * Your checklist (see EXERCISE.md):
 * 1. Build the screens below, using the same classes as the rest of the app
 *    (form-card surface, choice, primary-button, …) and the shared PageHead / SuccessHead.
 * 2. Events: "permit_application_started" is sent for you when someone clicks your card.
 *    Send journeyEvent("permit_application_completed", { … }) when the journey is done, plus any
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
        <button className="primary-button" onClick={() => journeyEvent("permit_application_completed")}>{lang === "de" ? "Beispiel-Button" : "Example button"}</button>
      </section>
    </>
  );
}

export const feature: Feature = {
  id: "parking-permit",
  ready: false,
  icon: Car,
  tone: "blue",
  title: { en: "Apply for a parking permit", de: "Anwohnerparkausweis beantragen" },
  description: { en: "Request a resident parking permit for your zone.", de: "Beantrage einen Parkausweis für deine Zone." },
  events: { started: "permit_application_started", completed: "permit_application_completed" },
  Screen,
};
