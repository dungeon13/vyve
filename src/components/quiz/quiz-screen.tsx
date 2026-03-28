"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "./quiz-context";
import { QuestionChips } from "./question-chips";
import { QuestionSlider } from "./question-slider";
import { QuestionDropdown } from "./question-dropdown";
import { QuizQuestion } from "./quiz-question";
import type { QuizAnswers } from "@/types/quiz";
import { ChevronLeft } from "lucide-react";

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 36 : -36,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -36 : 36,
    opacity: 0,
  }),
};

export function QuizScreen() {
  const { currentQuestion, answers, config, goBack, answerQuestion, isComplete } = useQuiz();
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState(1);
  const prevQ = useRef(currentQuestion);

  const question = config.questions[currentQuestion];
  const currentValue = question ? answers[question.key] : undefined;
  const remainingQuestions = config.total_questions - (currentQuestion + 1);

  const handleBack = useCallback(() => {
    setSlideDir(-1);
    goBack();
  }, [goBack]);

  const handleAnswer = useCallback(
    (value: string | number) => {
      if (animating || !question) return;
      const key = question.key as keyof QuizAnswers;

      if (question.type === "chips" || question.type === "dropdown") {
        setAnimating(true);
        setSlideDir(1);
        setTimeout(() => {
          answerQuestion(key, value);
          setAnimating(false);
        }, 280);
      } else {
        setSlideDir(1);
        answerQuestion(key, value);
      }
    },
    [question, answerQuestion, animating]
  );

  useEffect(() => {
    if (currentQuestion > prevQ.current) setSlideDir(1);
    if (currentQuestion < prevQ.current) setSlideDir(-1);
    prevQ.current = currentQuestion;
    setAnimating(false);
  }, [currentQuestion]);

  if (isComplete || !question) return null;

  const progressPct = ((currentQuestion + 1) / config.total_questions) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <div className="h-1.5 w-full overflow-hidden bg-[var(--bg3)]">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--teal)] to-[var(--gold)]"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      <div className="flex items-center border-b border-[var(--border)] bg-[var(--bg2)]/90 px-[var(--pad-x)] py-3 backdrop-blur-md">
        {currentQuestion > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go to previous question"
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-xl px-2 text-[var(--text2)] transition-colors hover:text-[var(--text)]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold">Back</span>
          </button>
        ) : (
          <div className="min-h-[44px] min-w-[44px]" aria-hidden />
        )}
        <div className="ml-auto text-right">
          <span className="block font-mono-label text-[12px] font-semibold text-[var(--text2)]">
            Question {currentQuestion + 1} of {config.total_questions}
          </span>
          <span className="block text-[11px] text-[var(--text3)]">
            {remainingQuestions > 0 ? `${remainingQuestions} left` : "Almost done"}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden px-[var(--pad-x)] pb-12 pt-6">
        <AnimatePresence mode="wait" custom={slideDir}>
          <motion.div
            key={question.id}
            custom={slideDir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="mx-auto w-full max-w-[480px] flex-1"
          >
            <div
              className={`glass-card rounded-[var(--radius-card)] p-6 md:p-8 ${animating ? "pointer-events-none opacity-40" : ""}`}
            >
              <QuizQuestion title={question.question} tooltip={question.tooltip}>
                {question.type === "chips" && (
                  <QuestionChips
                    question={question}
                    value={currentValue as string | undefined}
                    onSelect={(v) => handleAnswer(v)}
                  />
                )}
                {question.type === "slider" && (
                  <QuestionSlider
                    question={question}
                    value={currentValue as number | undefined}
                    onSelect={(v) => handleAnswer(v)}
                  />
                )}
                {question.type === "dropdown" && (
                  <QuestionDropdown
                    question={question}
                    value={currentValue as string | undefined}
                    onSelect={(v) => handleAnswer(v)}
                  />
                )}
              </QuizQuestion>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
