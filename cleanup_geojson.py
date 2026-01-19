import json

# Load the GeoJSON file
with open('township_live.geojson', 'r', encoding='utf-8') as f:
    geojson_data = json.load(f)

# Properties to remove
properties_to_remove = ["ST", "DT", "TS_PCODE", "TS_MMR"]

# Remove properties from all features
for feature in geojson_data['features']:
    if 'properties' in feature:
        for prop in properties_to_remove:
            if prop in feature['properties']:
                del feature['properties'][prop]

# Save the cleaned data to a new file
with open('township_live_cleaned.geojson', 'w', encoding='utf-8') as f:
    json.dump(geojson_data, f, ensure_ascii=False, indent=2)

print("Cleanup complete! Removed properties: ST, DT, TS_PCODE, TS_MMR")
print("Cleaned file saved as: township_live_cleaned.geojson")
