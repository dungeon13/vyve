import posthog from "posthog-js";

export const track = {
  landingViewed: () => posthog.capture("landing_page_viewed"),
  ctaClicked: () => posthog.capture("cta_clicked"),

  quizStarted: () => posthog.capture("quiz_started"),
  questionAnswered: (q: number, value: string | number) =>
    posthog.capture("question_answered", { question_number: q, value }),
  quizCompleted: (durationMs: number) =>
    posthog.capture("quiz_completed", { duration_ms: durationMs }),
  quizAbandoned: (lastQuestion: number) =>
    posthog.capture("quiz_abandoned", { last_question: lastQuestion }),

  scoreRevealed: (composite: number, fin: number, career: number, health: number) =>
    posthog.capture("score_revealed", {
      composite_score: composite,
      financial_score: fin,
      career_score: career,
      health_score: health,
    }),
  methodologyExpanded: () => posthog.capture("methodology_expanded"),

  actionPlanViewed: () => posthog.capture("action_plan_viewed"),
  actionClicked: (pillar: string, actionKey: string) =>
    posthog.capture("action_clicked", { pillar, action_key: actionKey }),

  phoneCaptureShown: () => posthog.capture("phone_capture_shown"),
  phoneSubmitted: () => posthog.capture("phone_submitted"),
  authCompleted: () => posthog.capture("auth_completed"),
  authSkipped: () => posthog.capture("auth_skipped"),

  shareCardShown: () => posthog.capture("share_card_shown"),
  shareWhatsappClicked: (cardId: string) =>
    posthog.capture("share_whatsapp_clicked", { card_id: cardId }),
  shareLinkCopied: (cardId: string) =>
    posthog.capture("share_link_copied", { card_id: cardId }),

  mondayBriefOpened: (weekNumber: number) =>
    posthog.capture("monday_brief_opened", { week_number: weekNumber }),
  mondayBriefActionClicked: (actionKey: string) =>
    posthog.capture("monday_brief_action_clicked", { action_key: actionKey }),

  feedbackSubmitted: (feelsTrue: boolean) =>
    posthog.capture("feedback_submitted", { feels_true: feelsTrue }),
};
