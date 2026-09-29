import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { Language } from "@/lib/copy";

export type FeatureScreenProps = {
  lang: Language;
  /** Back to the landing page without finishing. */
  onBack: () => void;
  /** Back to the landing page after the journey is done. */
  onDone: () => void;
};

export type Feature = {
  /** Also the deep link: /?view=<id> opens the feature without sending its started event. */
  id: string;
  /** Set to true when your feature is ready; only ready features get a card on the landing page. */
  ready: boolean;
  icon: LucideIcon;
  tone: "blue" | "peach" | "lilac" | "mint";
  title: Record<Language, string>;
  description: Record<Language, string>;
  /** `started` is sent for you when someone clicks your card. Send `completed` yourself with journeyEvent(). */
  events: { started: string; completed: string };
  Screen: ComponentType<FeatureScreenProps>;
};
