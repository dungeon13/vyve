export type EmotionalState = "overwhelmed" | "managing" | "okay" | "thriving";

export interface QuizAnswers {
  age: number;
  city: string;
  salary_range: string;
  savings_rate: string;
  term_insurance: string;
  emi_burden: string;
  family_support: string;
  industry: string;
  experience_years: number;
  sleep_hours: number;
  exercise_days: string;
  emotional_state: EmotionalState;
}

export interface ScoreResult {
  financial_score: number;
  career_score: number;
  health_score: number;
  composite_score: number;
  emotional_state: EmotionalState;
  cohort_key: string;
  weights: { f: number; c: number; h: number };
  lowest_pillar: "financial" | "career" | "health";
}

export type QuestionType = "slider" | "chips" | "dropdown";

export interface QuizQuestion {
  id: number;
  key: keyof QuizAnswers;
  question: string;
  type: QuestionType;
  options?: { label: string; value: string }[];
  slider?: { min: number; max: number; step: number; default: number; unit?: string };
  dropdown?: { options: { label: string; value: string }[]; pinned?: string[] };
  tooltip?: string;
  scoring_use: string;
}

export interface QuizConfig {
  country_code: string;
  questions: QuizQuestion[];
  total_questions: number;
}
