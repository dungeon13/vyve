import { spawn } from "node:child_process";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: true });
    child.on("exit", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${command} ${args.join(" ")} failed with ${code}`));
    });
  });
}

async function main() {
  console.log("== Phase 2 ingestion cycle ==");
  console.log("Step 1/2: Fetching open baselines...");
  await run("node", ["scripts/data/fetch_open_baselines.mjs"]);
  console.log("Step 2/2: Validating baseline outputs...");
  await run("node", ["scripts/data/validate_baselines.mjs"]);
  console.log("Ingestion cycle completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
