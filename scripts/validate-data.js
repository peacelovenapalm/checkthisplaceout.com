const fs = require("fs");
const path = require("path");

const readJson = (filePath) =>
  JSON.parse(fs.readFileSync(filePath, "utf8"));

const categoriesPath = path.join(__dirname, "..", "data", "categories.json");
const placesPath = path.join(__dirname, "..", "data", "places.json");

const categories = readJson(categoriesPath);
const places = readJson(placesPath);

const errors = [];
const warnings = [];

const isNonEmptyString = (value) => typeof value === "string" && value.trim();
const isNumber = (value) => typeof value === "number" && !Number.isNaN(value);
const isValidUrl = (value) => {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const pushError = (message) => errors.push(message);
const pushWarning = (message) => warnings.push(message);

const categorySlugs = new Set();

categories.forEach((category, index) => {
  const prefix = `categories[${index}]`;

  if (!isNonEmptyString(category.slug)) {
    pushError(`${prefix}.slug must be a non-empty string`);
  } else if (categorySlugs.has(category.slug)) {
    pushError(`${prefix}.slug must be unique (${category.slug})`);
  } else {
    categorySlugs.add(category.slug);
  }

  if (!isNonEmptyString(category.title)) {
    pushError(`${prefix}.title must be a non-empty string`);
  }
  if (!isNonEmptyString(category.caption)) {
    pushError(`${prefix}.caption must be a non-empty string`);
  }
  if (!isNonEmptyString(category.icon)) {
    pushError(`${prefix}.icon must be a non-empty string`);
  }
  if (!isNumber(category.order)) {
    pushError(`${prefix}.order must be a number`);
  }
});

const placeIds = new Set();

places.forEach((place, index) => {
  const prefix = `places[${index}]`;

  if (!isNonEmptyString(place.id)) {
    pushError(`${prefix}.id must be a non-empty string`);
  } else if (placeIds.has(place.id)) {
    pushError(`${prefix}.id must be unique (${place.id})`);
  } else {
    placeIds.add(place.id);
  }

  [
    "name",
    "area",
    "oneLiner",
    "story",
    "signatureMove",
    "bestTime"
  ].forEach((field) => {
    if (!isNonEmptyString(place[field])) {
      pushError(`${prefix}.${field} must be a non-empty string`);
    }
  });

  if (!Array.isArray(place.categories) || place.categories.length === 0) {
    pushError(`${prefix}.categories must be a non-empty array`);
  } else {
    place.categories.forEach((category) => {
      if (!categorySlugs.has(category)) {
        pushError(`${prefix}.categories includes unknown slug (${category})`);
      }
    });
  }

  if (!isNumber(place.lat) || place.lat < -90 || place.lat > 90) {
    pushError(`${prefix}.lat must be a valid latitude`);
  }
  if (!isNumber(place.lng) || place.lng < -180 || place.lng > 180) {
    pushError(`${prefix}.lng must be a valid longitude`);
  }

  const priceValues = ["", "$", "$$", "$$$"];
  if (place.price !== undefined && !priceValues.includes(place.price)) {
    pushError(`${prefix}.price must be one of ${priceValues.join(", ")}`);
  }

  if (!Array.isArray(place.vibes) || place.vibes.length < 2) {
    pushError(`${prefix}.vibes must be an array with at least 2 items`);
  }

  if (!place.links || typeof place.links !== "object") {
    pushError(`${prefix}.links must be an object`);
  } else {
    if (!isValidUrl(place.links.googleMapsUrl)) {
      pushError(`${prefix}.links.googleMapsUrl must be a valid URL`);
    }
    if (place.links.appleMapsUrl && !isValidUrl(place.links.appleMapsUrl)) {
      pushError(`${prefix}.links.appleMapsUrl must be a valid URL`);
    }
    if (place.links.instagramUrl && !isValidUrl(place.links.instagramUrl)) {
      pushError(`${prefix}.links.instagramUrl must be a valid URL`);
    }
    if (place.links.websiteUrl && !isValidUrl(place.links.websiteUrl)) {
      pushError(`${prefix}.links.websiteUrl must be a valid URL`);
    }
    if (place.links.phone && !isNonEmptyString(place.links.phone)) {
      pushError(`${prefix}.links.phone must be a string`);
    }
  }

  if (!place.images || place.images.length === 0) {
    pushWarning(`${prefix}.images is missing or empty`);
  }
  if (!place.links.appleMapsUrl) {
    pushWarning(`${prefix}.links.appleMapsUrl is missing`);
  }
});

if (warnings.length) {
  console.warn("Warnings:\n" + warnings.map((w) => `- ${w}`).join("\n"));
}

if (errors.length) {
  console.error("Errors:\n" + errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}

console.log("Data validation passed.");
