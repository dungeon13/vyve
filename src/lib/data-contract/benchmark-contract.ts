export const CITY_IDS = [
  "in_delhi_ncr",
  "in_mumbai",
  "in_bengaluru",
  "in_hyderabad",
  "in_chennai",
  "in_kolkata",
  "in_pune",
  "in_ahmedabad",
] as const;

export type CityId = (typeof CITY_IDS)[number];

export const ROLE_FAMILIES = [
  "engineering",
  "product",
  "design",
  "sales",
  "marketing",
  "operations",
  "finance",
  "hr",
  "other",
] as const;

export type RoleFamily = (typeof ROLE_FAMILIES)[number];

export const YOE_BANDS = ["0_2", "3_5", "6_9", "10_plus"] as const;
export type YoeBand = (typeof YOE_BANDS)[number];

export const AGE_BANDS = ["18_24", "25_30", "31_40", "41_plus"] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export interface SegmentKey {
  roleFamily: RoleFamily;
  yoeBand: YoeBand;
  ageBand: AgeBand;
}

export interface CityBenchmarkRecord {
  cityId: CityId;
  periodWeek: string;
  sourceId: string;
  metricName: string;
  metricValue: number;
  unit: string;
  segmentKey: string;
  coverageScore: number;
  freshnessDays: number;
}

export interface ActivityRecord {
  activityId: string;
  cityId: CityId;
  category: string;
  title: string;
  lat: number;
  lng: number;
  costBand: "low" | "medium" | "high" | "unknown";
  rating: number | null;
  hoursText: string | null;
  availabilitySignal: number;
  sourceConfidence: number;
}

export function toSegmentKey(input: SegmentKey): string {
  return `${input.ageBand}|${input.roleFamily}|${input.yoeBand}`;
}
