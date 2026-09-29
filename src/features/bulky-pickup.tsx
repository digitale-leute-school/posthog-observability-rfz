"use client";

import { Truck } from "lucide-react";
import { journeyEvent } from "@/lib/analytics";
import { PageHead } from "@/components/page-parts";
import type { Feature, FeatureScreenProps } from "./types";

/*
 * Group 2: Book a bulky waste pickup
 *
 * The journey: Pick the items to collect (sofa, mattress, fridge …), choose a pickup date, enter the street, review and confirm.
 *
 * Your checklist (see EXERCISE.md):
 * 1. Build the screens below, using the same classes as the rest of the app
 *    (form-card surface, choice, primary-button, …) and the shared PageHead / SuccessHead.
 * 2. Events: "pickup_booking_started" is sent for you when someone clicks your card.
 *    Send journeyEvent("pickup_booking_completed", { … }) when the journey is done, plus any
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
        <button className="primary-button" onClick={() => journeyEvent("pickup_booking_completed")}>{lang === "de" ? "Beispiel-Button" : "Example button"}</button>
      </section>
    </>
  );
}

export const feature: Feature = {
  id: "bulky-pickup",
  ready: false,
  icon: Truck,
  tone: "peach",
  title: { en: "Book a bulky waste pickup", de: "Sperrmüll-Abholung buchen" },
  description: { en: "Get large items collected from your street.", de: "Lass große Gegenstände von deiner Straße abholen." },
  events: { started: "pickup_booking_started", completed: "pickup_booking_completed" },
  Screen,
};
