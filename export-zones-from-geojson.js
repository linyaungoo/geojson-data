import fs from "fs";

// ================= CONFIG =================
const INPUT_GEOJSON = "./township_live_cleaned_test.geojson";
const OUTPUT_CSV = "./travel_zones.csv";

// ================= LOAD GEOJSON =================
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"));

if (!Array.isArray(geojson.features)) {
  throw new Error("❌ Invalid GeoJSON: features array not found");
}

// ================= HELPERS =================
function polygonToWKT(coordinates) {
  const ring = coordinates[0]; // outer ring only

  const points = ring
    .map(([lng, lat]) => `${lng} ${lat}`)
    .join(", ");

  return `POLYGON((${points}))`;
}

function getTownshipName(props = {}) {
  return (
    props.TS ||
    props.township ||
    props.Township ||
    props.name ||
    "Unknown Township"
  );
}

// ================= BUILD CSV =================
const rows = [];
rows.push("zone_id,zone_name,status,zone_polygon");

let zoneCounter = 1;

for (const feature of geojson.features) {
  if (feature.geometry?.type !== "Polygon") continue;

  const props = feature.properties || {};

  const zone_id = `Z${zoneCounter++}`;
  const townshipName = getTownshipName(props);
  const zone_name = `${townshipName}`;

  const status =
    props.status ||
    "Business As Usual"; // default if missing

  const zone_polygon = polygonToWKT(feature.geometry.coordinates);

  rows.push(
    `"${zone_id}","${zone_name}","${status}","${zone_polygon}"`
  );
}

// ================= WRITE CSV =================
fs.writeFileSync(OUTPUT_CSV, rows.join("\n"), "utf8");

console.log("✅ Zone CSV exported successfully");
console.log(`📍 Total zones: ${zoneCounter - 1}`);
console.log(`📄 File: ${OUTPUT_CSV}`);
