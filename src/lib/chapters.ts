export type Chapter = {
  id: string;
  label: string;
  /** Seconds on showcase.mp4 (~10s) */
  t0: number;
  t1: number;
  /** Scroll progress 0–1 */
  from: number;
  to: number;
  eyebrow: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
  /** Veil treatment — void = black macro inventory shots */
  mood: "kitchen" | "void" | "pass";
};

/** Beat-for-beat with showcase.mp4 storyboard (1s ≈ 0.1 progress). */
export const CHAPTERS: Chapter[] = [
  {
    id: "walkthrough",
    label: "00",
    t0: 0,
    t1: 1,
    from: 0,
    to: 0.1,
    eyebrow: "The kitchen walkthrough",
    title: "Service moves fast.\nYour systems shouldn’t slow it.",
    body: "SousXChef rides the line with you—one kitchen brain for inventory, labor, and staff questions so you’re not the bottleneck between stations.",
    align: "left",
    mood: "kitchen",
  },
  {
    id: "threshold",
    label: "01",
    t0: 1,
    t1: 2,
    from: 0.1,
    to: 0.2,
    eyebrow: "The threshold",
    title: "Pull the handle.\nWe read what’s inside.",
    body: "Staff open the walk-in and snap a photo. The inventory agent logs what’s actually on the shelf—no clipboard, no “I thought we had it.”",
    align: "right",
    mood: "kitchen",
  },
  {
    id: "cooler",
    label: "02",
    t0: 2,
    t1: 3,
    from: 0.2,
    to: 0.3,
    eyebrow: "The cooler",
    title: "Every shelf.\nEvery crate.\nLive.",
    body: "Wire racks become structured counts. Low stock, missing SKUs, and odd par levels surface before the dinner ticket hits the rail.",
    align: "left",
    mood: "kitchen",
  },
  {
    id: "tomatoes",
    label: "03",
    t0: 3,
    t1: 4,
    from: 0.3,
    to: 0.4,
    eyebrow: "Inventory · heirloom tomatoes",
    title: "Perishables don’t wait\nfor spreadsheets.",
    body: "Track short-life produce by photo. Get alerts when volume won’t cover the weekend—so freshness stays on the plate, not in the bin.",
    align: "right",
    mood: "void",
  },
  {
    id: "wagyu",
    label: "04",
    t0: 4,
    t1: 5,
    from: 0.4,
    to: 0.5,
    eyebrow: "Inventory · A5 Wagyu",
    title: "A5 is too expensive\nto guess.",
    body: "High-value cuts get watched like the pass watches tickets. Spot shrinkage early, lock pars, and know true cost before it walks.",
    align: "left",
    mood: "void",
  },
  {
    id: "pecorino",
    label: "05",
    t0: 5,
    t1: 6,
    from: 0.5,
    to: 0.6,
    eyebrow: "Inventory · aged pecorino",
    title: "Specialty counted.\nNot hoped for.",
    body: "Cheeses and dry goods stay in the brain. Staff ask “how much left?” over SMS. The agent answers from the last verified log.",
    align: "right",
    mood: "void",
  },
  {
    id: "shiso",
    label: "06",
    t0: 6,
    t1: 7,
    from: 0.6,
    to: 0.7,
    eyebrow: "Inventory · fresh shiso",
    title: "Shiso wilts.\nDemand shouldn’t surprise you.",
    body: "Fragile herbs need tight foresight. Demand hints tell you what to prep and buy before a soft Tuesday or a slammed Saturday.",
    align: "left",
    mood: "void",
  },
  {
    id: "truffles",
    label: "07",
    t0: 7,
    t1: 8,
    from: 0.7,
    to: 0.8,
    eyebrow: "Inventory · black truffles",
    title: "Never 86 a premium\nmid-service.",
    body: "Premium SKUs trigger hard alerts. When stock dips under par, owners and leads know—before the guest orders what you can’t fire.",
    align: "right",
    mood: "void",
  },
  {
    id: "return",
    label: "08",
    t0: 8,
    t1: 9,
    from: 0.8,
    to: 0.9,
    eyebrow: "The return",
    title: "From cold room\nto warm amber light.",
    body: "Inventory truth feeds labor and chat. Who closes? What’s 86’d? Agents answer so your team stays on the line—not in your DMs.",
    align: "left",
    mood: "kitchen",
  },
  {
    id: "plate",
    label: "09",
    t0: 9,
    t1: 10,
    from: 0.9,
    to: 1,
    eyebrow: "The final plate",
    title: "Chefs finish the plate.\nAgents finish the chaos.",
    body: "While the pass finalizes the dish, SousXChef keeps counts, schedules, and staff answers running quietly behind the line.",
    align: "center",
    mood: "pass",
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
