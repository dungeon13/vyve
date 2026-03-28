import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, "data", "procurement", "seed_activities.json");
const OUTPUT_PATH = path.join(ROOT, "data", "procurement", "seed_activity_recommendations.json");

function costBandCompatibility(userBand, activityBand) {
  if (activityBand === "unknown") return 0.6;
  if (userBand === activityBand) return 1;
  if (userBand === "high") return 0.9;
  if (userBand === "medium" && activityBand === "low") return 0.9;
  return 0.4;
}

function impactForPillar(pillar, activity) {
  if (pillar === "financial") return activity.impactFinancial;
  if (pillar === "career") return activity.impactCareer;
  return activity.impactHealth;
}

function rank(weakestPillar, budgetBand, maxDistanceKm, activities) {
  return activities
    .filter((a) => a.distanceKm <= maxDistanceKm)
    .map((a) => {
      const impact = impactForPillar(weakestPillar, a);
      const distanceFit = Math.max(0, 1 - a.distanceKm / maxDistanceKm);
      const adherence = ((a.rating ?? 3.5) / 5) * 0.5 + a.availabilitySignal * 0.5;
      const costFit = costBandCompatibility(budgetBand, a.costBand);
      const score =
        impact * 0.45 +
        distanceFit * 100 * 0.2 +
        adherence * 100 * 0.15 +
        costFit * 100 * 0.1 +
        a.sourceConfidence * 100 * 0.1;
      return { ...a, score: Math.round(score * 100) / 100 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

async function main() {
  const raw = await readFile(INPUT_PATH, "utf8");
  const activities = JSON.parse(raw);

  const output = {
    generatedAt: new Date().toISOString(),
    scenarios: {
      weakest_financial: rank("financial", "medium", 8, activities),
      weakest_career: rank("career", "medium", 8, activities),
      weakest_health: rank("health", "medium", 8, activities),
    },
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");
  console.log(`Wrote activity recommendations: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
