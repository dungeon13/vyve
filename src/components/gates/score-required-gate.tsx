"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/components/quiz/quiz-context";
import { ErrorState } from "@/components/ui/error-state";

interface Props {
  skeleton: ReactNode;
  children: ReactNode;
}

/**
 * Client-only: shows skeleton until mounted, then requires scoreResult from quiz session.
 * Missing score shows a recoverable error (prompt: error state + retry / alternate action).
 */
export function ScoreRequiredGate({ skeleton, children }: Props) {
  const router = useRouter();
  const { scoreResult } = useQuiz();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{skeleton}</>;
  }

  if (!scoreResult) {
    return (
      <ErrorState
        title="No LifeScore in this session"
        description="Take the 2-minute quiz on the home screen first. Your scores stay on this device until you refresh or clear storage."
        actionLabel="Get my LifeScore"
        onAction={() => router.push("/")}
        secondaryLabel="Try again"
        onSecondary={() => router.refresh()}
      />
    );
  }

  return <>{children}</>;
}
