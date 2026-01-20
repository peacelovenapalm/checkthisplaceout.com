#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");

const loadEnv = (filename) => {
  const filePath = path.resolve(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath });
  }
};

loadEnv(".env.local");
loadEnv(".env");

const log = (label, value) => {
  process.stdout.write(`${label}: ${value}\n`);
};

const checkCommand = (command, args) => {
  const result = spawnSync(command, args, { stdio: "pipe", encoding: "utf8" });
  if (result.error) {
    return { ok: false, message: result.error.message };
  }
  if (result.status !== 0) {
    return { ok: false, message: result.stderr.trim() || "command failed" };
  }
  return { ok: true, message: result.stdout.trim() };
};

const nodeCheck = checkCommand("node", ["-v"]);
log("node", nodeCheck.ok ? nodeCheck.message : `missing (${nodeCheck.message})`);

const npmCheck = checkCommand("npm", ["-v"]);
log("npm", npmCheck.ok ? npmCheck.message : `missing (${npmCheck.message})`);

const env = process.env;
const mask = (value) => {
  if (!value) return "missing";
  if (value.length <= 8) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};
const hasUrl = Boolean(env.NEXT_PUBLIC_SUPABASE_URL);
const hasPublishable = Boolean(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
const hasAnon = Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const hasSecret = Boolean(env.SUPABASE_SECRET_KEY);

log("NEXT_PUBLIC_SUPABASE_URL", hasUrl ? mask(env.NEXT_PUBLIC_SUPABASE_URL) : "missing");
log(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  hasPublishable ? mask(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) : "missing"
);

const keyPath = hasPublishable
  ? "publishable"
  : hasAnon
  ? "anon (legacy fallback, not used by app)"
  : "none";
log("public key path", keyPath);

if (!hasPublishable && hasAnon) {
  log(
    "warning",
    "publishable key is required by the app; anon key alone will fail"
  );
}

log("SUPABASE_SECRET_KEY", hasSecret ? mask(env.SUPABASE_SECRET_KEY) : "missing");
if (!hasSecret) {
  log("warning", "admin actions need SUPABASE_SECRET_KEY");
}
