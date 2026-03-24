export interface Action {
  key: string;
  pillar: "financial" | "career" | "health";
  type: "risk" | "win" | "action";
  title: string;
  description: string;
  condition?: {
    field: string;
    operator: "eq" | "lt" | "gt" | "in";
    value: string | number | string[];
  };
  cta?: string;
  priority: number;
}

export const ACTIONS_LIBRARY: Action[] = [
  // === FINANCIAL ===
  {
    key: "fin_no_insurance",
    pillar: "financial",
    type: "risk",
    title: "No term life insurance",
    description: "67% of techies your age don't have it either \u2014 but one health scare changes everything. A basic Rs.1Cr policy costs ~Rs.700/month.",
    condition: { field: "term_insurance", operator: "eq", value: "no" },
    priority: 1,
  },
  {
    key: "fin_high_emi",
    pillar: "financial",
    type: "risk",
    title: "EMIs eating over 40% of salary",
    description: "This leaves almost no room for emergencies. Consider consolidating or refinancing to get under 30%.",
    condition: { field: "emi_burden", operator: "eq", value: "40%+" },
    priority: 2,
  },
  {
    key: "fin_zero_savings",
    pillar: "financial",
    type: "risk",
    title: "Zero savings rate",
    description: "Even Rs.5,000/month into a SIP changes your trajectory. Start with 5% of salary this week.",
    condition: { field: "savings_rate", operator: "in", value: ["0%", "<5%"] },
    priority: 3,
  },
  {
    key: "fin_good_savings",
    pillar: "financial",
    type: "win",
    title: "Strong savings discipline",
    description: "You save more than 78% of your peers. Consider diversifying: are you overly reliant on FDs?",
    condition: { field: "savings_rate", operator: "in", value: ["10-20%", "20%+"] },
    priority: 4,
  },
  {
    key: "fin_has_insurance",
    pillar: "financial",
    type: "win",
    title: "Term insurance in place",
    description: "You're ahead of 67% of your peers. Smart move. Make sure coverage is at least 10x annual income.",
    condition: { field: "term_insurance", operator: "eq", value: "yes" },
    priority: 5,
  },
  {
    key: "fin_family_support",
    pillar: "financial",
    type: "action",
    title: "Optimize family support",
    description: "You support your family \u2014 that's admirable. Set up a separate auto-transfer so it doesn't eat into savings.",
    condition: { field: "family_support", operator: "in", value: ["10-20%", "20%+"] },
    cta: "Plan family budget",
    priority: 6,
  },
  {
    key: "fin_start_sip",
    pillar: "financial",
    type: "action",
    title: "Start a Rs.5,000 SIP this week",
    description: "Rs.5,000/month at 12% over 10 years = Rs.11.6L. Start small, stay consistent.",
    cta: "Set up SIP",
    priority: 7,
  },
  {
    key: "fin_emergency_fund",
    pillar: "financial",
    type: "action",
    title: "Build a 6-month emergency fund",
    description: "Target 6 months of expenses in a liquid fund. Not FD \u2014 liquid fund for instant access.",
    cta: "Calculate your target",
    priority: 8,
  },

  // === CAREER ===
  {
    key: "career_behind_peers",
    pillar: "career",
    type: "risk",
    title: "Salary below peer median",
    description: "Your compensation is below the median for your experience and city. This gap compounds over time.",
    priority: 1,
  },
  {
    key: "career_services_trap",
    pillar: "career",
    type: "risk",
    title: "Services company ceiling approaching",
    description: "Services company engineers earn 31% less by Year 7 vs. product company peers. Consider switching if you're past Year 4.",
    condition: { field: "experience_years", operator: "gt", value: 4 },
    priority: 2,
  },
  {
    key: "career_ahead_peers",
    pillar: "career",
    type: "win",
    title: "Earning above peer median",
    description: "Your career velocity is strong. Now's the time to negotiate equity or leadership responsibilities.",
    priority: 3,
  },
  {
    key: "career_early_strong",
    pillar: "career",
    type: "win",
    title: "Strong start for your experience level",
    description: "You're ahead of where most people are at your stage. Stay aggressive on skill-building.",
    condition: { field: "experience_years", operator: "lt", value: 4 },
    priority: 4,
  },
  {
    key: "career_negotiate",
    pillar: "career",
    type: "action",
    title: "Negotiate your next review",
    description: "67% of IT professionals haven't negotiated in 18+ months. Market rates moved up 18%. The cost of not asking: Rs.2-4 LPA.",
    cta: "Prepare for negotiation",
    priority: 5,
  },
  {
    key: "career_upskill",
    pillar: "career",
    type: "action",
    title: "Pick one high-leverage skill",
    description: "AI/ML, Cloud Architecture, or System Design \u2014 pick one and go deep for 90 days. Career velocity follows skill leverage.",
    cta: "Choose your skill",
    priority: 6,
  },
  {
    key: "career_network",
    pillar: "career",
    type: "action",
    title: "Have 2 coffee chats this month",
    description: "80% of career moves come through networks, not job boards. Two conversations can change your trajectory.",
    cta: "Schedule a chat",
    priority: 7,
  },

  // === HEALTH ===
  {
    key: "health_poor_sleep",
    pillar: "health",
    type: "risk",
    title: "Severe sleep deficit",
    description: "Less than 6 hours drops productivity by 23% and raises burnout risk 2.3x. This undermines everything else.",
    condition: { field: "sleep_hours", operator: "lt", value: 6 },
    priority: 1,
  },
  {
    key: "health_no_exercise",
    pillar: "health",
    type: "risk",
    title: "Zero exercise days",
    description: "Sedentary professionals have 2x the rate of lifestyle diseases. Even 20 minutes of walking changes the equation.",
    condition: { field: "exercise_days", operator: "eq", value: "0" },
    priority: 2,
  },
  {
    key: "health_good_sleep",
    pillar: "health",
    type: "win",
    title: "Healthy sleep pattern",
    description: "7+ hours puts you in the top 30% of Indian tech workers. Your body is recovering \u2014 keep protecting this.",
    condition: { field: "sleep_hours", operator: "gt", value: 7 },
    priority: 3,
  },
  {
    key: "health_active",
    pillar: "health",
    type: "win",
    title: "Consistent exercise habit",
    description: "3+ days of exercise puts you ahead of 70% of your peers. This compounds into career energy and longevity.",
    condition: { field: "exercise_days", operator: "in", value: ["3-4", "5+"] },
    priority: 4,
  },
  {
    key: "health_sleep_fix",
    pillar: "health",
    type: "action",
    title: "Fix your sleep by Friday",
    description: "Set a phone alarm for 11PM. Put it in another room. No screens 30 min before. Start tonight.",
    cta: "Set sleep alarm",
    priority: 5,
  },
  {
    key: "health_walk_20",
    pillar: "health",
    type: "action",
    title: "20-minute daily walk",
    description: "Walk after lunch. No gym needed. 20 min/day reduces all-cause mortality by 33%. The ROI on walking is insane.",
    cta: "Start today",
    priority: 6,
  },
  {
    key: "health_desk_stretch",
    pillar: "health",
    type: "action",
    title: "Desk stretches every 2 hours",
    description: "Set a timer. Stand, stretch, breathe for 2 minutes. Reduces neck/back pain by 41%.",
    cta: "Set reminder",
    priority: 7,
  },
];

export function getActionsForUser(answers: Record<string, unknown>): {
  financial: { risk: Action | null; win: Action | null; action: Action | null };
  career: { risk: Action | null; win: Action | null; action: Action | null };
  health: { risk: Action | null; win: Action | null; action: Action | null };
} {
  const result = {
    financial: { risk: null as Action | null, win: null as Action | null, action: null as Action | null },
    career: { risk: null as Action | null, win: null as Action | null, action: null as Action | null },
    health: { risk: null as Action | null, win: null as Action | null, action: null as Action | null },
  };

  for (const action of ACTIONS_LIBRARY) {
    const bucket = result[action.pillar];
    if (bucket[action.type]) continue;

    if (!action.condition || evaluateCondition(action.condition, answers)) {
      bucket[action.type] = action;
    }
  }

  return result;
}

function evaluateCondition(
  cond: NonNullable<Action["condition"]>,
  answers: Record<string, unknown>
): boolean {
  const val = answers[cond.field];
  switch (cond.operator) {
    case "eq": return val === cond.value;
    case "lt": return typeof val === "number" && val < (cond.value as number);
    case "gt": return typeof val === "number" && val > (cond.value as number);
    case "in": return Array.isArray(cond.value) && cond.value.includes(val as string);
    default: return false;
  }
}
