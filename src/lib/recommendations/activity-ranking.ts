export interface ActivityCandidate {
  activityId: string;
  category: string;
  costBand: "low" | "medium" | "high" | "unknown";
  distanceKm: number;
  rating: number | null;
  availabilitySignal: number;
  sourceConfidence: number;
  impactFinancial: number;
  impactCareer: number;
  impactHealth: number;
}

export interface RecommendationInput {
  weakestPillar: "financial" | "career" | "health";
  budgetBand: "low" | "medium" | "high";
  maxDistanceKm: number;
}

function costBandCompatibility(
  userBand: "low" | "medium" | "high",
  activityBand: "low" | "medium" | "high" | "unknown"
): number {
  if (activityBand === "unknown") return 0.6;
  if (userBand === activityBand) return 1;
  if (userBand === "high") return 0.9;
  if (userBand === "medium" && activityBand === "low") return 0.9;
  return 0.4;
}

function pillarImpact(
  weakestPillar: "financial" | "career" | "health",
  candidate: ActivityCandidate
): number {
  if (weakestPillar === "financial") return candidate.impactFinancial;
  if (weakestPillar === "career") return candidate.impactCareer;
  return candidate.impactHealth;
}

export function rankActivityCandidates(
  input: RecommendationInput,
  candidates: ActivityCandidate[],
  limit = 3
): Array<ActivityCandidate & { score: number }> {
  const scored = candidates
    .filter((c) => c.distanceKm <= input.maxDistanceKm)
    .map((candidate) => {
      const impact = pillarImpact(input.weakestPillar, candidate);
      const feasibleDistance = Math.max(0, 1 - candidate.distanceKm / input.maxDistanceKm);
      const costFit = costBandCompatibility(input.budgetBand, candidate.costBand);
      const rating = candidate.rating ?? 3.5;
      const adherence = (rating / 5) * 0.5 + candidate.availabilitySignal * 0.5;
      const score =
        impact * 0.45 +
        feasibleDistance * 100 * 0.2 +
        costFit * 100 * 0.15 +
        adherence * 100 * 0.1 +
        candidate.sourceConfidence * 100 * 0.1;

      return { ...candidate, score: Math.round(score * 100) / 100 };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
