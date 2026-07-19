export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  qty: number;
  par: number;
  highValue: boolean;
};

export type ScheduleSlot = {
  id: string;
  day: string;
  role: string;
  name: string;
  start: string;
  end: string;
};

export type ChatMessage = {
  id: string;
  from: "staff" | "agent" | "system";
  author: string;
  text: string;
  at: string;
  channel: "telegram" | "sms" | "app";
};

export type ForecastHint = {
  id: string;
  day: string;
  covers: number;
  note: string;
};

export type RestaurantProfile = {
  id: string;
  name: string;
  location: string;
  seats: number;
  pains: string[];
  channels: string[];
  categories: string[];
  skus: string[];
  telegramLinked: boolean;
  telegramLinkCode: string;
  onboardingComplete: boolean;
};

export type DemoStore = {
  profile: RestaurantProfile;
  inventory: InventoryItem[];
  schedule: ScheduleSlot[];
  messages: ChatMessage[];
  forecast: ForecastHint[];
  session: { email: string; name: string } | null;
};

export const DEMO_KEY = "sousxchef-demo-v1";

export function createSeedStore(): DemoStore {
  const now = new Date();
  const iso = (minsAgo: number) =>
    new Date(now.getTime() - minsAgo * 60_000).toISOString();

  return {
    session: null,
    profile: {
      id: "rest_maison_demo",
      name: "Maison Demo",
      location: "Ottawa, ON",
      seats: 48,
      pains: ["inventory", "chat"],
      channels: ["telegram"],
      categories: ["Proteins", "Produce", "Dairy"],
      skus: ["A5 Wagyu", "Heirloom tomatoes", "Fresh shiso"],
      telegramLinked: false,
      telegramLinkCode: `link_${Math.random().toString(36).slice(2, 10)}`,
      onboardingComplete: false,
    },
    inventory: [
      {
        id: "inv_1",
        name: "A5 Wagyu",
        category: "Proteins",
        unit: "kg",
        qty: 2.4,
        par: 4,
        highValue: true,
      },
      {
        id: "inv_2",
        name: "Atlantic salmon",
        category: "Proteins",
        unit: "kg",
        qty: 6.1,
        par: 5,
        highValue: true,
      },
      {
        id: "inv_3",
        name: "Heirloom tomatoes",
        category: "Produce",
        unit: "kg",
        qty: 1.2,
        par: 3,
        highValue: false,
      },
      {
        id: "inv_4",
        name: "Fresh shiso",
        category: "Produce",
        unit: "bunches",
        qty: 4,
        par: 8,
        highValue: false,
      },
      {
        id: "inv_5",
        name: "Aged pecorino",
        category: "Dairy",
        unit: "kg",
        qty: 0.8,
        par: 1.5,
        highValue: true,
      },
      {
        id: "inv_6",
        name: "Black truffles",
        category: "Specialty",
        unit: "g",
        qty: 45,
        par: 80,
        highValue: true,
      },
    ],
    schedule: [
      { id: "sch_1", day: "Mon", role: "Chef", name: "Diego", start: "10:00", end: "22:00" },
      { id: "sch_2", day: "Mon", role: "Line", name: "Maya", start: "16:00", end: "23:00" },
      { id: "sch_3", day: "Tue", role: "Chef", name: "Diego", start: "10:00", end: "22:00" },
      { id: "sch_4", day: "Wed", role: "Chef", name: "Priya", start: "11:00", end: "22:00" },
      { id: "sch_5", day: "Thu", role: "Line", name: "Sam", start: "15:00", end: "23:00" },
      { id: "sch_6", day: "Fri", role: "Chef", name: "Diego", start: "10:00", end: "23:00" },
      { id: "sch_7", day: "Fri", role: "Line", name: "Maya", start: "16:00", end: "00:00" },
      { id: "sch_8", day: "Sat", role: "Chef", name: "Diego", start: "10:00", end: "23:30" },
      { id: "sch_9", day: "Sat", role: "Line", name: "Sam", start: "15:00", end: "00:30" },
      { id: "sch_10", day: "Sun", role: "Chef", name: "Priya", start: "11:00", end: "21:00" },
    ],
    messages: [
      {
        id: "msg_1",
        from: "staff",
        author: "Maya",
        text: "How much salmon left?",
        at: iso(42),
        channel: "telegram",
      },
      {
        id: "msg_2",
        from: "agent",
        author: "SousXChef",
        text: "Atlantic salmon: 6.1 kg on hand (par 5). You're above par.",
        at: iso(41),
        channel: "telegram",
      },
      {
        id: "msg_3",
        from: "staff",
        author: "Sam",
        text: "Who closes Thursday?",
        at: iso(18),
        channel: "telegram",
      },
      {
        id: "msg_4",
        from: "agent",
        author: "SousXChef",
        text: "Thursday close: Sam on Line 15:00–23:00. No chef close tagged yet.",
        at: iso(17),
        channel: "telegram",
      },
    ],
    forecast: [
      { id: "f1", day: "Mon", covers: 62, note: "Steady — normal protein prep" },
      { id: "f2", day: "Tue", covers: 48, note: "Soft night — watch tomato waste" },
      { id: "f3", day: "Wed", covers: 71, note: "Local event — bump salmon" },
      { id: "f4", day: "Thu", covers: 55, note: "Average" },
      { id: "f5", day: "Fri", covers: 94, note: "Rush — full line + wagyu par check" },
      { id: "f6", day: "Sat", covers: 110, note: "Peak — confirm truffle par" },
      { id: "f7", day: "Sun", covers: 58, note: "Brunch lean — herb order Monday" },
    ],
  };
}

export function loadDemoStore(): DemoStore {
  if (typeof window === "undefined") return createSeedStore();
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) {
      const seed = createSeedStore();
      localStorage.setItem(DEMO_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as DemoStore;
  } catch {
    return createSeedStore();
  }
}

export function saveDemoStore(store: DemoStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_KEY, JSON.stringify(store));
}

export function answerInventoryQuestion(q: string, inventory: InventoryItem[]): string {
  const lower = q.toLowerCase();
  const hit = inventory.find((i) => lower.includes(i.name.toLowerCase().split(" ")[0]!));
  if (hit) {
    const status =
      hit.qty < hit.par
        ? `Below par (${hit.par} ${hit.unit}). Reorder soon.`
        : `Above par (${hit.par} ${hit.unit}).`;
    return `${hit.name}: ${hit.qty} ${hit.unit} on hand. ${status}`;
  }
  if (lower.includes("86") || lower.includes("out")) {
    const lows = inventory.filter((i) => i.qty < i.par);
    if (!lows.length) return "Nothing under par right now.";
    return `Under par: ${lows.map((i) => `${i.name} (${i.qty} ${i.unit})`).join(", ")}.`;
  }
  if (lower.includes("close") || lower.includes("schedule") || lower.includes("who")) {
    return "Check Schedule in the dashboard for tonight's coverage — or ask “who closes Friday?” with a day name once labor agent is linked.";
  }
  return "I can answer inventory and schedule questions. Try “how much salmon left?” or “what's under par?”";
}
