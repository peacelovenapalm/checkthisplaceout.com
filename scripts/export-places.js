const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
};

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const secretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!secretKey) {
  console.error(
    "Missing SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) for export."
  );
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeOptional = (value) => {
  const text = normalizeText(value);
  return text ? text : undefined;
};

const normalizeArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
};

const normalizeNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const normalizePrice = (value) =>
  value === "$" || value === "$$" || value === "$$$" || value === ""
    ? value
    : "";

const normalizeWarnings = (value) => {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    if (!items.length) return undefined;
    return items.length === 1 ? items[0] : items;
  }
  const text = normalizeText(value);
  return text ? text : undefined;
};

const mapPlace = (row) => {
  const links = row.links ?? {};
  const mappedLinks = {
    googleMapsUrl: normalizeText(links.googleMapsUrl)
  };
  const appleMapsUrl = normalizeOptional(links.appleMapsUrl);
  const instagramUrl = normalizeOptional(links.instagramUrl);
  const websiteUrl = normalizeOptional(links.websiteUrl);
  const phone = normalizeOptional(links.phone);

  if (appleMapsUrl) mappedLinks.appleMapsUrl = appleMapsUrl;
  if (instagramUrl) mappedLinks.instagramUrl = instagramUrl;
  if (websiteUrl) mappedLinks.websiteUrl = websiteUrl;
  if (phone) mappedLinks.phone = phone;

  const warnings = normalizeWarnings(row.warnings);

  return {
    id: normalizeText(row.slug || row.id),
    name: normalizeText(row.title),
    categories: normalizeArray(row.categories),
    area: normalizeText(row.area),
    lat: normalizeNumber(row.lat),
    lng: normalizeNumber(row.lng),
    oneLiner: normalizeText(row.description_short),
    story: normalizeText(row.story),
    signatureMove: normalizeText(row.signature_move),
    bestTime: normalizeText(row.best_time),
    vibes: normalizeArray(row.vibes),
    price: normalizePrice(row.price),
    links: mappedLinks,
    images: normalizeArray(row.images),
    ...(warnings ? { warnings } : {})
  };
};

const run = async () => {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("status", "approved")
    .order("title");

  if (error) {
    throw new Error(error.message);
  }

  const output = (data ?? [])
    .map(mapPlace)
    .sort((a, b) => a.name.localeCompare(b.name));

  const outPath = path.join(__dirname, "..", "data", "places.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
  console.log(`Exported ${output.length} places to data/places.json`);
};

run().catch((error) => {
  console.error(error.message || "Export failed.");
  process.exit(1);
});
