export type Chapter = {
  id: string;
  label: string;
  /** Video progress start (0–1) */
  from: number;
  /** Video progress end (0–1) */
  to: number;
  eyebrow: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
};

/** Storyboard synced to showcase.mp4 (~10s): line → walk-in → steak → leaves → plating */
export const CHAPTERS: Chapter[] = [
  {
    id: "open",
    label: "01",
    from: 0,
    to: 0.18,
    eyebrow: "The dinner rush",
    title: "Your staff just texted\n“we’re out of chicken.”\nAgain.",
    body: "The line is moving. Tickets are stacking. And you’re still the inventory system, the scheduler, and the answering machine.",
    align: "left",
  },
  {
    id: "inventory",
    label: "02",
    from: 0.18,
    to: 0.38,
    eyebrow: "Inventory agent",
    title: "Walk-in truth,\nnot spreadsheet fiction.",
    body: "Staff snap a photo of the cooler. SousXChef counts what’s actually there—proteins, produce, prep—so “we’re out” never blindsides service.",
    align: "right",
  },
  {
    id: "cost",
    label: "03",
    from: 0.38,
    to: 0.55,
    eyebrow: "Food cost",
    title: "Every cut has a cost.\nKnow it before it walks.",
    body: "Track high-value items in real time. Spot shrinkage early. Keep food cost tight without standing in the walk-in with a clipboard.",
    align: "left",
  },
  {
    id: "forecast",
    label: "04",
    from: 0.55,
    to: 0.72,
    eyebrow: "Demand forecast",
    title: "Order for the week\nyou’ll actually have.",
    body: "AI reads your sales patterns and suggests prep and purchasing before slow nights and rushes—so freshness stays on the plate, not in the trash.",
    align: "right",
  },
  {
    id: "labor",
    label: "05",
    from: 0.72,
    to: 0.88,
    eyebrow: "Labor + chat",
    title: "Chefs cook.\nAgents handle the rest.",
    body: "Auto-suggest staffing for busy days. Answer inventory and schedule questions over WhatsApp or SMS—so your team stays on the pass, not in your DMs.",
    align: "left",
  },
  {
    id: "close",
    label: "06",
    from: 0.88,
    to: 1,
    eyebrow: "SousXChef",
    title: "One brain.\nYour whole kitchen.",
    body: "Inventory, labor, forecasting, and staff chat—running quietly while you run the floor.",
    align: "center",
  },
];

export const PROOF_QUOTES = [
  {
    quote:
      "I used to get twenty inventory texts a night. Now the walk-in answers itself—and I actually leave on time.",
    name: "Marcus Chen",
    role: "Owner, 48-seat bistro",
  },
  {
    quote:
      "We stopped over-ordering proteins by almost a fifth in the first month. The forecast isn’t magic—it’s just never offline.",
    name: "Priya Nair",
    role: "GM, multi-unit casual",
  },
  {
    quote:
      "Scheduling used to be Sunday dread. Now the agent drafts the week and I only tweak for call-outs.",
    name: "Diego Alvarez",
    role: "Executive chef",
  },
];

export const PRICING_TIERS = [
  {
    name: "Line",
    price: "$149",
    period: "/mo",
    blurb: "One location. Inventory photos, SMS answers, basic forecast.",
    features: ["Photo inventory logs", "SMS / WhatsApp Q&A", "7-day demand hint", "Owner dashboard"],
    cta: "Start with Line",
    featured: false,
  },
  {
    name: "Pass",
    price: "$349",
    period: "/mo",
    blurb: "Full agents—labor, forecasting, and live ops for serious volume.",
    features: [
      "Everything in Line",
      "Labor scheduling agent",
      "Sales forecasting + promos",
      "Priority onboarding",
    ],
    cta: "Book Pass demo",
    featured: true,
  },
  {
    name: "House",
    price: "Custom",
    period: "",
    blurb: "Multi-unit kitchens that need shared brains and custom workflows.",
    features: ["Multi-location rollup", "Custom integrations", "Dedicated success", "SLA support"],
    cta: "Talk to us",
    featured: false,
  },
];
