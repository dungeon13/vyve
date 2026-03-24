"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { QuizAnswers, QuizConfig, ScoreResult } from "@/types/quiz";
import { INDIA_QUIZ_CONFIG } from "@/lib/config/india";
import { track } from "@/lib/analytics/events";

interface QuizState {
  currentQuestion: number;
  answers: Partial<QuizAnswers>;
  config: QuizConfig;
  isComplete: boolean;
  scoreResult: ScoreResult | null;
  startTime: number | null;
}

interface QuizContextType extends QuizState {
  startQuiz: () => void;
  answerQuestion: (key: keyof QuizAnswers, value: string | number) => void;
  goBack: () => void;
  setScoreResult: (result: ScoreResult) => void;
  resetQuiz: () => void;
  progress: number;
}

const QuizContext = createContext<QuizContextType | null>(null);

const INITIAL_STATE: QuizState = {
  currentQuestion: 0,
  answers: {},
  config: INDIA_QUIZ_CONFIG,
  isComplete: false,
  scoreResult: null,
  startTime: null,
};

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>(INITIAL_STATE);

  const startQuiz = useCallback(() => {
    track.quizStarted();
    setState((s) => ({ ...s, currentQuestion: 0, startTime: Date.now() }));
  }, []);

  const answerQuestion = useCallback(
    (key: keyof QuizAnswers, value: string | number) => {
      setState((prev) => {
        const newAnswers = { ...prev.answers, [key]: value };
        const questionNum = prev.currentQuestion + 1;

        track.questionAnswered(questionNum, value);

        const isLast = questionNum >= prev.config.total_questions;

        if (isLast && prev.startTime) {
          track.quizCompleted(Date.now() - prev.startTime);
        }

        return {
          ...prev,
          answers: newAnswers,
          currentQuestion: isLast ? prev.currentQuestion : prev.currentQuestion + 1,
          isComplete: isLast,
        };
      });
    },
    []
  );

  const goBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
      isComplete: false,
    }));
  }, []);

  const setScoreResult = useCallback((result: ScoreResult) => {
    setState((prev) => ({ ...prev, scoreResult: result }));
  }, []);

  const resetQuiz = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const progress =
    state.config.total_questions > 0
      ? ((state.currentQuestion + (state.isComplete ? 1 : 0)) / state.config.total_questions) * 100
      : 0;

  return (
    <QuizContext.Provider
      value={{
        ...state,
        startQuiz,
        answerQuestion,
        goBack,
        setScoreResult,
        resetQuiz,
        progress,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
