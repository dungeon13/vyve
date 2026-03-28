import { readFile } from "node:fs/promises";
import path from "node:path";

const TODAY = new Date().toISOString().slice(0, 10);
const ROOT = process.cwd();
const MANIFEST_PATH = path.join(
  ROOT,
  "data",
  "procurement",
  "baselines",
  TODAY,
  "manifest.json"
);

function freshnessScore(days) {
  if (days <= 1) return 1.0;
  if (days <= 3) return 0.9;
  if (days <= 7) return 0.75;
  if (days <= 14) return 0.6;
  return 0.4;
}

async function main() {
  const raw = await readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(raw);
  const generatedAt = new Date();
  const rows = manifest.map((item) => ({
    source_id: item.source_id,
    status: item.status,
    freshness_days: 0,
    freshness_score: freshnessScore(0),
    checked_at: generatedAt.toISOString(),
  }));

  const failed = rows.filter((r) => r.status !== "downloaded");
  console.table(rows);
  if (failed.length) {
    console.error(`Validation failed: ${failed.length} sources failed to download.`);
    process.exit(1);
  }
  console.log("Baseline validation passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
