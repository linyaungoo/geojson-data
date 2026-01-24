import fs from "fs";

// ===== CONFIG =====
const INPUT_GEOJSON = "./township_base.geojson";
const OUTPUT_CSV = "./travel_zones.csv";

// ===== LOAD GEOJSON =====
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"));

if (!geojson.features || !Array.isArray(geojson.features)) {
  throw new Error("Invalid GeoJSON: features not found");
}

// ===== HELPERS =====
function polygonToWKT(coordinates) {
  // GeoJSON: [ [ [lng, lat], [lng, lat], ... ] ]
  const ring = coordinates[0];

  const points = ring
    .map(([lng, lat]) => `${lng} ${lat}`)
    .join(", ");

  return `POLYGON((${points}))`;
}

// ===== BUILD CSV =====
const rows = [];
rows.push("zone_id,zone_name,status,zone_polygon");

for (const feature of geojson.features) {
  if (feature.geometry?.type !== "Polygon") continue;

  const zone_id = feature.properties?.zone_id ?? "";
  const zone_name = feature.properties?.zone_name ?? "";
  const status = feature.properties?.status ?? "Business As Usual";

  const zone_polygon = polygonToWKT(feature.geometry.coordinates);

  rows.push(
    `"${zone_id}","${zone_name}","${status}","${zone_polygon}"`
  );
}

// ===== WRITE FILE =====
fs.writeFileSync(OUTPUT_CSV, rows.join("\n"), "utf8");

console.log(`✅ CSV exported: ${OUTPUT_CSV}`);
console.log(`📍 Zones exported: ${rows.length - 1}`);
