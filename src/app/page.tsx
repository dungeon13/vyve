"use client";

import { useState, useCallback, useEffect } from "react";
import { Hero } from "@/components/landing/hero";
import { QuizProvider, useQuiz } from "@/components/quiz/quiz-context";
import { QuizScreen } from "@/components/quiz/quiz-screen";
import { LoadingScreen } from "@/components/quiz/loading-screen";
import { ScoreDisplay } from "@/components/score/score-display";
import { ActionPlan } from "@/components/score/action-plan";
import { ShareScreen } from "@/components/score/share-screen";
import { PhoneCapture } from "@/components/score/phone-capture";
import { calculateCompositeScore } from "@/lib/scoring/engine";
import { track } from "@/lib/analytics/events";
import { getSessionId } from "@/lib/session";
import type { QuizAnswers } from "@/types/quiz";

type AppScreen = "landing" | "quiz" | "loading" | "score" | "actions" | "share" | "phone";

function AppContent() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const { answers, isComplete, scoreResult, setScoreResult } = useQuiz();

  const handleStartQuiz = useCallback(() => {
    setScreen("quiz");
  }, []);

  const handleQuizComplete = useCallback(() => {
    setScreen("loading");
  }, []);

  const handleLoadingComplete = useCallback(() => {
    const result = calculateCompositeScore(answers as QuizAnswers);
    setScoreResult(result);
    track.scoreRevealed(result.composite_score, result.financial_score, result.career_score, result.health_score);

    saveQuizToServer(answers as QuizAnswers, result);
    setScreen("score");
  }, [answers, setScoreResult]);

  const handleSaveScore = useCallback(() => {
    track.phoneCaptureShown();
    setScreen("phone");
  }, []);

  useEffect(() => {
    if (screen === "quiz" && isComplete) {
      handleQuizComplete();
    }
  }, [screen, isComplete, handleQuizComplete]);

  if (screen === "landing") {
    return <Hero onStart={handleStartQuiz} />;
  }

  if (screen === "quiz") {
    return <QuizScreen />;
  }

  if (screen === "loading") {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (screen === "score" && scoreResult) {
    return <ScoreDisplay result={scoreResult} onContinue={() => setScreen("actions")} />;
  }

  if (screen === "actions" && scoreResult) {
    return (
      <ActionPlan
        answers={answers as QuizAnswers}
        result={scoreResult}
        onContinue={() => setScreen("share")}
      />
    );
  }

  if (screen === "share" && scoreResult) {
    return (
      <ShareScreen
        result={scoreResult}
        answers={answers}
        onSaveScore={handleSaveScore}
      />
    );
  }

  if (screen === "phone") {
    return (
      <PhoneCapture
        onVerified={() => setScreen("landing")}
        onSkip={() => setScreen("landing")}
      />
    );
  }

  return <Hero onStart={handleStartQuiz} />;
}

async function saveQuizToServer(answers: QuizAnswers, result: ReturnType<typeof calculateCompositeScore>) {
  try {
    const sessionId = getSessionId();
    await fetch("/api/quiz/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, result, session_id: sessionId }),
    });
  } catch {
    // Non-critical — score was already calculated client-side
  }
}

export default function Home() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}
