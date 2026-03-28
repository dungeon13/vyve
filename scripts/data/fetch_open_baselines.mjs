import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TODAY = new Date().toISOString().slice(0, 10);
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "data", "procurement", "baselines", TODAY);

const SOURCES = [
  {
    id: "ppac_metro_fuel",
    url: "https://ppac.gov.in/retail-selling-price-rsp-of-petrol-diesel-and-domestic-lpg/rsp-of-petrol-and-diesel-in-metro-cities-since-16-6-2017",
    filename: "ppac_metro_fuel.html",
    note: "Metro fuel source page snapshot for parser onboarding.",
  },
  {
    id: "rbi_dbie_home",
    url: "https://data.rbi.org.in/DBIE/#/dbie/home",
    filename: "rbi_dbie_home.html",
    note: "RBI DBIE source home snapshot for benchmarks.",
  },
  {
    id: "overpass_api_wiki",
    url: "https://wiki.openstreetmap.org/wiki/Overpass_API",
    filename: "overpass_api_wiki.html",
    note: "Open data activity source specification snapshot.",
  },
  {
    id: "openaq_docs",
    url: "https://docs.openaq.org/resources/measurements",
    filename: "openaq_measurements_docs.html",
    note: "OpenAQ docs snapshot for parser and schema mapping.",
  },
];

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "vyve-phase2-baseline-fetcher/1.0",
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed for ${url}: ${res.status}`);
  }
  return await res.text();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = [];

  for (const source of SOURCES) {
    try {
      const content = await fetchText(source.url);
      const filePath = path.join(OUT_DIR, source.filename);
      await writeFile(filePath, content, "utf8");
      manifest.push({
        source_id: source.id,
        url: source.url,
        filename: source.filename,
        status: "downloaded",
        note: source.note,
      });
      console.log(`[ok] ${source.id} -> ${source.filename}`);
    } catch (error) {
      manifest.push({
        source_id: source.id,
        url: source.url,
        filename: source.filename,
        status: "failed",
        note: error instanceof Error ? error.message : "unknown error",
      });
      console.error(`[fail] ${source.id}`, error);
    }
  }

  const manifestPath = path.join(OUT_DIR, "manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Wrote manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
