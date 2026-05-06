import { ProtocolId, protocolPricing } from "@/app/lib/productData";

export interface ProtocolSelectorData {
  id: ProtocolId;
  name: string;
  outcome: string;
  forPeopleWho: string;
  flowPercentage: number;
  clarityPercentage: number;
  isUltimate: boolean;
  benefits: string[];
  startingPrice: string;
  isPremium?: boolean;
}

// Protocol selector data with simplified, outcome-focused content
export const protocolSelectorData: Record<ProtocolId, ProtocolSelectorData> = {
  "1": {
    id: "1",
    name: "Resilience Protocol",
    outcome: "Calm, sustainable focus",
    forPeopleWho: "want strong focus without jitters, crashes, or next-day burnout",
    flowPercentage: 75,
    clarityPercentage: 25,
    isUltimate: false,
    benefits: [
      "Better stress response",
      "Reduced burnout & faster recovery",
      "Improved sleep quality",
    ],
    startingPrice: `From £${protocolPricing.standard.subscription.starter.price}`,
  },
  "2": {
    id: "2",
    name: "Precision Protocol",
    outcome: "Maximum clarity under pressure",
    forPeopleWho: "feel mentally foggy and need sharp, sustained cognitive performance",
    flowPercentage: 25,
    clarityPercentage: 75,
    isUltimate: false,
    benefits: [
      "Enhanced memory & attention",
      "Increased cerebral blood flow",
      "Reduced mental fatigue",
    ],
    startingPrice: `From £${protocolPricing.standard.subscription.starter.price}`,
  },
  "3": {
    id: "3",
    name: "Balance Protocol",
    outcome: "The perfect balance of clarity and focus",
    forPeopleWho: "want clarity and focus in equal measure",
    flowPercentage: 50,
    clarityPercentage: 50,
    isUltimate: false,
    benefits: [
      "Complete cognitive coverage",
      "Adaptogen + nootropic synergy",
      "Best of both worlds",
    ],
    startingPrice: `From £${protocolPricing.standard.subscription.starter.price}`,
  },
  "4": {
    id: "4",
    name: "Ultimate Protocol",
    outcome: "Peak performance, every day",
    forPeopleWho: "push their brain hard every single day",
    flowPercentage: 50,
    clarityPercentage: 50,
    isUltimate: true,
    isPremium: true,
    benefits: [
      "Daily adaptogen + nootropic stack",
      "Peak energy AND clarity",
      "Maximum neurological support",
    ],
    startingPrice: `From £${protocolPricing.ultimate.subscription.pro.price}`,
  },
};

// Get all protocols as array (ordered for display)
export const protocolsArray = [
  protocolSelectorData["1"],
  protocolSelectorData["2"],
  protocolSelectorData["3"],
  protocolSelectorData["4"],
];

// Default selected protocol (Balance - best seller)
export const DEFAULT_PROTOCOL_ID: ProtocolId = "3";
