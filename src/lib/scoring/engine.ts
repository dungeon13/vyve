import type { QuizAnswers, ScoreResult, EmotionalState } from "@/types/quiz";
import { SALARY_BENCHMARKS } from "@/data/salary-benchmarks";

const EMOTIONAL_WEIGHTS: Record<EmotionalState, { f: number; c: number; h: number }> = {
  overwhelmed: { f: 0.40, c: 0.25, h: 0.35 },
  managing: { f: 0.35, c: 0.30, h: 0.35 },
  okay: { f: 0.35, c: 0.30, h: 0.35 },
  thriving: { f: 0.35, c: 0.35, h: 0.30 },
};

export function calculateFinancialScore(answers: QuizAnswers): number {
  let raw = 0;

  const savingsPoints: Record<string, number> = {
    "0%": 5, "<5%": 5, "5-10%": 15, "10-20%": 28, "20%+": 48,
  };
  raw += savingsPoints[answers.savings_rate] ?? 0;

  const insurancePoints: Record<string, number> = {
    no: 0, "not_sure": 5, yes: 22,
  };
  raw += insurancePoints[answers.term_insurance] ?? 0;

  const emiPoints: Record<string, number> = {
    "40%+": 0, "20-40%": 8, "<20%": 16, "no_emi": 22,
  };
  raw += emiPoints[answers.emi_burden] ?? 0;

  return Math.round((raw / 92) * 100);
}

export function calculateCareerScore(answers: QuizAnswers): number {
  const salaryPercentile = getSalaryPercentile(
    answers.industry,
    answers.city,
    answers.experience_years,
    answers.salary_range
  );
  const salaryScore = 20 + salaryPercentile * 0.6;

  let velocityScore = 12;
  const expectedBand = getExpectedSalaryBand(answers.industry, answers.experience_years);
  const actualBandRank = getSalaryBandRank(answers.salary_range);
  const expectedBandRank = getSalaryBandRank(expectedBand);

  if (actualBandRank > expectedBandRank) velocityScore = 20;
  else if (actualBandRank < expectedBandRank) velocityScore = 5;

  return Math.round(salaryScore + velocityScore);
}

export function calculateHealthScore(answers: QuizAnswers): number {
  let raw = 0;

  const sleepHours = answers.sleep_hours;
  if (sleepHours < 5) raw += 5;
  else if (sleepHours < 6) raw += 12;
  else if (sleepHours < 7) raw += 22;
  else if (sleepHours <= 8) raw += 34;
  else raw += 42;

  const exercisePoints: Record<string, number> = {
    "0": 5, "1-2": 15, "3-4": 30, "5+": 42,
  };
  raw += exercisePoints[answers.exercise_days] ?? 5;

  return Math.round((raw / 84) * 100);
}

export function calculateCompositeScore(answers: QuizAnswers): ScoreResult {
  const financial = calculateFinancialScore(answers);
  const career = calculateCareerScore(answers);
  const health = calculateHealthScore(answers);
  const emotionalState = answers.emotional_state as EmotionalState;

  const weights = EMOTIONAL_WEIGHTS[emotionalState] ?? EMOTIONAL_WEIGHTS.okay;
  const composite = Math.round(
    financial * weights.f + career * weights.c + health * weights.h
  );

  const cohortKey = buildCohortKey(answers);

  return {
    financial_score: financial,
    career_score: career,
    health_score: health,
    composite_score: composite,
    emotional_state: emotionalState,
    cohort_key: cohortKey,
    weights,
    lowest_pillar: financial <= career && financial <= health
      ? "financial"
      : career <= health
        ? "career"
        : "health",
  };
}

function getSalaryPercentile(
  industry: string,
  city: string,
  yoe: number,
  salaryRange: string
): number {
  const key = `${industry}:${city}:${yoe}`;
  const benchmark = SALARY_BENCHMARKS[key];
  if (!benchmark) {
    const bandRank = getSalaryBandRank(salaryRange);
    return Math.min(95, Math.max(10, bandRank * 18));
  }
  const bandRank = getSalaryBandRank(salaryRange);
  const benchmarkRank = getSalaryBandRank(benchmark.median_band);
  const diff = bandRank - benchmarkRank;
  return Math.min(95, Math.max(5, 50 + diff * 15));
}

function getExpectedSalaryBand(industry: string, yoe: number): string {
  const bands = ["<30K", "30-50K", "50-75K", "75K-1.2L", "1.2-2L", "2L+"];
  let expectedIdx: number;

  if (industry === "IT" || industry === "Finance" || industry === "Consulting") {
    expectedIdx = Math.min(5, Math.floor(yoe / 3));
  } else {
    expectedIdx = Math.min(5, Math.floor(yoe / 4));
  }

  return bands[expectedIdx];
}

function getSalaryBandRank(band: string): number {
  const ranks: Record<string, number> = {
    "<30K": 1, "30-50K": 2, "50-75K": 3, "75K-1.2L": 4, "1.2-2L": 5, "2L+": 6,
  };
  return ranks[band] ?? 3;
}

function buildCohortKey(answers: QuizAnswers): string {
  const ageGroup =
    answers.age < 25 ? "22-25" :
    answers.age < 30 ? "25-30" :
    answers.age < 35 ? "30-35" :
    answers.age < 40 ? "35-40" : "40+";

  return `${answers.city}:${answers.industry}:${ageGroup}`;
}
