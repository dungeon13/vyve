"use client";

import { useCallback, useRef } from "react";
import type { QuizAnswers, ScoreResult } from "@/types/quiz";
import { calculateCompositeScore } from "./engine";

export function useScoringWorker() {
  const workerRef = useRef<Worker | null>(null);

  const calculate = useCallback(
    (answers: QuizAnswers): Promise<ScoreResult> => {
      // Fallback to main thread if Web Workers aren't available
      if (typeof Worker === "undefined") {
        return Promise.resolve(calculateCompositeScore(answers));
      }

      return new Promise((resolve) => {
        try {
          if (!workerRef.current) {
            workerRef.current = new Worker(
              new URL("@/workers/scoring-worker.ts", import.meta.url)
            );
          }
          workerRef.current.onmessage = (e: MessageEvent<ScoreResult>) => {
            resolve(e.data);
          };
          workerRef.current.onerror = () => {
            resolve(calculateCompositeScore(answers));
          };
          workerRef.current.postMessage(answers);
        } catch {
          resolve(calculateCompositeScore(answers));
        }
      });
    },
    []
  );

  return { calculate };
}
