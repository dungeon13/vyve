"use client";

import type { ReactNode } from "react";
import { QuizProvider } from "@/components/quiz/quiz-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}
