import type { QuizAnswers, ScoreResult, EmotionalState } from "@/types/quiz";
import { SALARY_BENCHMARKS } from "@/data/salary-benchmarks";

const EMOTIONAL_WEIGHTS: Record<EmotionalState, { f: number; c: number; h: number }> = {
  overwhelmed: { f: 0.4, c: 0.25, h: 0.35 },
  managing: { f: 0.35, c: 0.3, h: 0.35 },
  okay: { f: 0.35, c: 0.3, h: 0.35 },
  thriving: { f: 0.35, c: 0.35, h: 0.3 },
};

const CALIBRATION_VERSION = "det-v1";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function toPercentileFromOrdinal(rank: number, maxRank: number): number {
  return clamp((rank / maxRank) * 100);
}

function scoreDriversToWeightedScore(
  items: Array<{ percentile: number; weight: number }>
): number {
  const weighted = items.reduce((sum, item) => sum + item.percentile * item.weight, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 50;
  return Math.round(clamp(weighted / totalWeight));
}

function getSalaryBandRank(band: string): number {
  const ranks: Record<string, number> = {
    "<30K": 1,
    "30-50K": 2,
    "50-75K": 3,
    "75K-1.2L": 4,
    "1.2-2L": 5,
    "2L+": 6,
  };
  return ranks[band] ?? 3;
}

function getSalaryPercentile(answers: QuizAnswers): number {
  const salaryRank = getSalaryBandRank(answers.salary_range);
  const normalizedYoe = Math.max(2, Math.min(15, Math.round(answers.experience_years)));
  const key = `${answers.industry}:${answers.city}:${normalizedYoe}`;
  const benchmark = SALARY_BENCHMARKS[key];
  if (!benchmark) {
    return toPercentileFromOrdinal(salaryRank, 6);
  }
  const medianRank = getSalaryBandRank(benchmark.median_band);
  const diff = salaryRank - medianRank;
  return clamp(50 + diff * 14, 5, 95);
}

function getSavingsPercentile(savingsRate: string): number {
  const rankMap: Record<string, number> = {
    "0%": 1,
    "<5%": 2,
    "5-10%": 3,
    "10-20%": 4,
    "20%+": 5,
  };
  return toPercentileFromOrdinal(rankMap[savingsRate] ?? 2, 5);
}

function getSavingsNumeric(savingsRate: string): number {
  const valueMap: Record<string, number> = {
    "0%": 0,
    "<5%": 2.5,
    "5-10%": 7.5,
    "10-20%": 15,
    "20%+": 20,
  };
  return valueMap[savingsRate] ?? 2.5;
}

function getEmiPercentile(emiBurden: string): number {
  const rankMap: Record<string, number> = {
    "40%+": 1,
    "20-40%": 2,
    "<20%": 4,
    no_emi: 5,
  };
  return toPercentileFromOrdinal(rankMap[emiBurden] ?? 2, 5);
}

function getInsurancePercentile(termInsurance: string): number {
  const rankMap: Record<string, number> = {
    no: 1,
    not_sure: 2,
    yes: 5,
  };
  return toPercentileFromOrdinal(rankMap[termInsurance] ?? 2, 5);
}

function getSleepPercentile(hours: number): number {
  if (hours < 5) return 10;
  if (hours < 6) return 25;
  if (hours < 7) return 50;
  if (hours <= 8) return 82;
  return 65;
}

function getExercisePercentile(days: string): number {
  const rankMap: Record<string, number> = {
    "0": 1,
    "1-2": 2,
    "3-4": 4,
    "5+": 5,
  };
  return toPercentileFromOrdinal(rankMap[days] ?? 2, 5);
}

function getExerciseNumeric(days: string): number {
  const valueMap: Record<string, number> = {
    "0": 0,
    "1-2": 2,
    "3-4": 4,
    "5+": 5,
  };
  return valueMap[days] ?? 2;
}

function getCareerMomentumPercentile(experienceYears: number): number {
  if (experienceYears < 2) return 45;
  if (experienceYears < 5) return 60;
  if (experienceYears < 8) return 70;
  if (experienceYears < 12) return 65;
  return 58;
}

function buildCohortKey(answers: QuizAnswers): string {
  const ageGroup =
    answers.age < 25
      ? "22-25"
      : answers.age < 30
        ? "25-30"
        : answers.age < 35
          ? "30-35"
          : answers.age < 40
            ? "35-40"
            : "40+";
  return `${answers.city}:${answers.industry}:${ageGroup}`;
}

export function calculateCompositeScore(answers: QuizAnswers): ScoreResult {
  const emotionalState = answers.emotional_state as EmotionalState;
  const weights = EMOTIONAL_WEIGHTS[emotionalState] ?? EMOTIONAL_WEIGHTS.okay;

  const financialDrivers = [
    { metric: "savings_rate", percentile: getSavingsPercentile(answers.savings_rate), value: getSavingsNumeric(answers.savings_rate), weight: 0.4 },
    { metric: "emi_burden", percentile: getEmiPercentile(answers.emi_burden), value: getSalaryBandRank(answers.salary_range), weight: 0.3 },
    { metric: "term_insurance", percentile: getInsurancePercentile(answers.term_insurance), value: answers.term_insurance === "yes" ? 1 : 0, weight: 0.3 },
  ];

  const careerDrivers = [
    { metric: "salary_percentile_city_segment", percentile: getSalaryPercentile(answers), value: getSalaryBandRank(answers.salary_range), weight: 0.7 },
    { metric: "career_momentum", percentile: getCareerMomentumPercentile(answers.experience_years), value: answers.experience_years, weight: 0.3 },
  ];

  const healthDrivers = [
    { metric: "sleep_hours", percentile: getSleepPercentile(answers.sleep_hours), value: answers.sleep_hours, weight: 0.55 },
    { metric: "exercise_days", percentile: getExercisePercentile(answers.exercise_days), value: getExerciseNumeric(answers.exercise_days), weight: 0.45 },
  ];

  const financial = scoreDriversToWeightedScore(financialDrivers);
  const career = scoreDriversToWeightedScore(careerDrivers);
  const health = scoreDriversToWeightedScore(healthDrivers);

  const composite = Math.round(
    financial * weights.f + career * weights.c + health * weights.h
  );

  const lowestPillar =
    financial <= career && financial <= health
      ? "financial"
      : career <= health
        ? "career"
        : "health";

  return {
    financial_score: financial,
    career_score: career,
    health_score: health,
    composite_score: composite,
    emotional_state: emotionalState,
    cohort_key: buildCohortKey(answers),
    weights,
    lowest_pillar: lowestPillar,
    calibration_version: CALIBRATION_VERSION,
    confidence: 0.72,
    score_drivers: [
      ...financialDrivers.map((d) => ({ pillar: "financial" as const, ...d })),
      ...careerDrivers.map((d) => ({ pillar: "career" as const, ...d })),
      ...healthDrivers.map((d) => ({ pillar: "health" as const, ...d })),
    ],
  };
}
