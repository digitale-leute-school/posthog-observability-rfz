// One file per team. Only features with ready: true appear on the landing page.
import { feature as communityEvents } from "./community-events";
import { feature as bulkyPickup } from "./bulky-pickup";
import { feature as parkingPermit } from "./parking-permit";
import { feature as volunteer } from "./volunteer";
import type { Feature } from "./types";

export const features: Feature[] = [communityEvents, bulkyPickup, parkingPermit, volunteer];
