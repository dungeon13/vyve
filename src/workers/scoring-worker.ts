import { calculateCompositeScore } from "@/lib/scoring/engine";
import type { QuizAnswers } from "@/types/quiz";

self.onmessage = (event: MessageEvent<QuizAnswers>) => {
  const answers = event.data;
  const result = calculateCompositeScore(answers);
  self.postMessage(result);
};
