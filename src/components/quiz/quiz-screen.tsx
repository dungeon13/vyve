"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuiz } from "./quiz-context";
import { QuestionChips } from "./question-chips";
import { QuestionSlider } from "./question-slider";
import { QuestionDropdown } from "./question-dropdown";
import type { QuizAnswers } from "@/types/quiz";
import { ChevronLeft } from "lucide-react";

export function QuizScreen() {
  const { currentQuestion, answers, config, goBack, answerQuestion, isComplete } = useQuiz();
  const [animating, setAnimating] = useState(false);

  const question = config.questions[currentQuestion];
  const currentValue = question ? answers[question.key] : undefined;
  const remainingQuestions = config.total_questions - (currentQuestion + 1);

  const handleAnswer = useCallback(
    (value: string | number) => {
      if (animating) return;
      const key = question.key as keyof QuizAnswers;

      if (question.type === "chips" || question.type === "dropdown") {
        setAnimating(true);
        setTimeout(() => {
          answerQuestion(key, value);
          setAnimating(false);
        }, 400);
      } else {
        answerQuestion(key, value);
      }
    },
    [question, answerQuestion, animating]
  );

  useEffect(() => {
    setAnimating(false);
  }, [currentQuestion]);

  if (isComplete || !question) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/60">
        <div
          className="h-full bg-gradient-to-r from-vyve-indigo to-vyve-amber transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestion + 1) / config.total_questions) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-3 backdrop-blur bg-white/55 border-b border-gray-100">
        {currentQuestion > 0 && (
          <button
            onClick={goBack}
            aria-label="Go to previous question"
            className="inline-flex items-center gap-1 p-2 -ml-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        <div className="ml-auto text-right">
          <span className="block text-sm text-gray-500 font-medium">
            Question {currentQuestion + 1} of {config.total_questions}
          </span>
          <span className="block text-xs text-gray-400">
            {remainingQuestions > 0 ? `${remainingQuestions} left` : "Almost done"}
          </span>
        </div>
      </div>

      {/* Question */}
      <div
        className={`flex-1 flex flex-col items-center justify-center px-4 pb-12
          transition-all duration-300 ${animating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
      >
        <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white/85 backdrop-blur p-6 md:p-8 shadow-xl shadow-vyve-indigo/5">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-gray-900 mb-2">
            {question.question}
          </h2>

          {question.tooltip && (
            <p className="text-sm text-vyve-amber font-medium mb-6 text-center">
              {question.tooltip}
            </p>
          )}
          <p className="text-xs text-gray-400 text-center mt-1">
            No right or wrong answers. This is your private snapshot.
          </p>

          <div className="w-full max-w-lg mx-auto mt-8">
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
          </div>
        </div>
      </div>
    </div>
  );
}
