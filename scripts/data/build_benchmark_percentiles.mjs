import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, "data", "procurement", "seed_city_benchmarks.json");
const OUTPUT_PATH = path.join(
  ROOT,
  "data",
  "procurement",
  "seed_city_benchmark_percentiles.json"
);

function percentile(sortedValues, q) {
  if (!sortedValues.length) return 0;
  const pos = (sortedValues.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedValues[base + 1] !== undefined) {
    return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
  }
  return sortedValues[base];
}

async function main() {
  const raw = await readFile(INPUT_PATH, "utf8");
  const rows = JSON.parse(raw);
  const grouped = new Map();

  for (const row of rows) {
    const key = `${row.city_id}|${row.segment_key}|${row.metric_name}`;
    const values = grouped.get(key) ?? [];
    values.push(Number(row.metric_value));
    grouped.set(key, values);
  }

  const output = [];
  for (const [key, values] of grouped.entries()) {
    values.sort((a, b) => a - b);
    output.push({
      key,
      p25: percentile(values, 0.25),
      p50: percentile(values, 0.5),
      p75: percentile(values, 0.75),
      sample_size: values.length,
    });
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");
  console.log(`Wrote ${output.length} percentile groups -> ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
