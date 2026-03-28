"use client";

import { useRouter } from "next/navigation";
import { useQuiz } from "@/components/quiz/quiz-context";
import { ScoreRequiredGate } from "@/components/gates/score-required-gate";
import { SharePageSkeleton } from "@/components/shells/page-skeletons";
import { ShareScreen } from "@/components/score/share-screen";

export default function SharePage() {
  return (
    <ScoreRequiredGate skeleton={<SharePageSkeleton />}>
      <ShareInner />
    </ScoreRequiredGate>
  );
}

function ShareInner() {
  const router = useRouter();
  const { scoreResult, answers } = useQuiz();

  if (!scoreResult) return null;

  return (
    <ShareScreen
      result={scoreResult}
      answers={answers}
      onSaveScore={() => router.push("/phone")}
      onSkip={() => router.replace("/dashboard")}
    />
  );
}
