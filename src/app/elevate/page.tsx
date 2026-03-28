"use client";

import { useRouter } from "next/navigation";
import { useQuiz } from "@/components/quiz/quiz-context";
import { ScoreRequiredGate } from "@/components/gates/score-required-gate";
import { ElevatePageSkeleton } from "@/components/shells/page-skeletons";
import { ActionPlan } from "@/components/score/action-plan";
import type { QuizAnswers } from "@/types/quiz";

export default function ElevatePage() {
  return (
    <ScoreRequiredGate skeleton={<ElevatePageSkeleton />}>
      <ElevateInner />
    </ScoreRequiredGate>
  );
}

function ElevateInner() {
  const router = useRouter();
  const { scoreResult, answers } = useQuiz();

  if (!scoreResult) return null;

  return (
    <ActionPlan
      answers={answers as QuizAnswers}
      result={scoreResult}
      onContinue={() => router.push("/share")}
    />
  );
}
