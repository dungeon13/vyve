export interface BenchmarkPoint {
  metricName: string;
  metricValue: number;
}

export interface UserMetricInput {
  metricName: string;
  metricValue: number;
  weight: number;
}

export interface PillarResult {
  score: number;
  drivers: Array<{ metricName: string; percentile: number; weight: number }>;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function percentileRank(
  metricValue: number,
  benchmarkValues: number[]
): number {
  if (!benchmarkValues.length) return 50;
  const sorted = [...benchmarkValues].sort((a, b) => a - b);
  const count = sorted.filter((v) => v <= metricValue).length;
  return clamp((count / sorted.length) * 100);
}

export function computePillarScore(
  userMetrics: UserMetricInput[],
  benchmarkMap: Map<string, number[]>
): PillarResult {
  if (!userMetrics.length) return { score: 50, drivers: [] };

  let weightedSum = 0;
  let totalWeight = 0;
  const drivers: Array<{ metricName: string; percentile: number; weight: number }> = [];

  for (const metric of userMetrics) {
    const benchmarkValues = benchmarkMap.get(metric.metricName) ?? [];
    const percentile = percentileRank(metric.metricValue, benchmarkValues);
    weightedSum += percentile * metric.weight;
    totalWeight += metric.weight;
    drivers.push({ metricName: metric.metricName, percentile, weight: metric.weight });
  }

  const score = totalWeight > 0 ? weightedSum / totalWeight : 50;
  return { score: Math.round(clamp(score)), drivers };
}

export function computeCompositeScore(
  financial: number,
  career: number,
  health: number
): number {
  // Equal-weight baseline; calibrated weights can override at runtime.
  return Math.round((financial + career + health) / 3);
}
