const fs = require("fs");

// ---- LOAD SOURCE GEOJSON ----
const src = JSON.parse(
  fs.readFileSync("mimu-geo-township.json", "utf8")
);

// ---- HTML VALUE EXTRACTOR ----
function extract(desc, key) {
  if (!desc) return null;

  const regex = new RegExp(
    `<span class="atr-name">${key}<\\/span>[\\s\\S]*?<span class="atr-value">([\\s\\S]*?)<\\/span>`,
    "i"
  );

  const match = desc.match(regex);
  return match ? match[1].trim() : null;
}

// ---- BUILD CLEAN GEOJSON ----
const out = {
  type: "FeatureCollection",
  features: []
};

for (const f of src.features) {
  out.features.push({
    type: "Feature",
    geometry: f.geometry, // 🔴 FULL GEOMETRY PRESERVED
    properties: {
      ST: extract(f.properties.description, "ST"),
      DT: extract(f.properties.description, "DT"),
      TS: extract(f.properties.description, "TS"),
      TS_PCODE: extract(f.properties.description, "TS_PCODE"),
      TS_MMR: extract(f.properties.description, "TS_MMR")
    }
  });
}

// ---- WRITE OUTPUT ----
fs.writeFileSync(
  "township_base.geojson",
  JSON.stringify(out, null, 2),
  "utf8"
);

console.log("✅ township_base.geojson generated successfully");
console.log("Features:", out.features.length);
