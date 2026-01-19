const fs = require('fs');

// Properties to remove
const propertiesToRemove = ["ST", "DT", "TS_PCODE", "TS_MMR"];

// Load the GeoJSON file
fs.readFile('township_live copy.geojson', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const geojsonData = JSON.parse(data);

    // Remove properties from all features
    geojsonData.features.forEach(feature => {
      if (feature.properties) {
        propertiesToRemove.forEach(prop => {
          if (prop in feature.properties) {
            delete feature.properties[prop];
          }
        });
      }
    });

    // Save the cleaned data to a new file
    fs.writeFile('township_live_cleaned.geojson', JSON.stringify(geojsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Cleanup complete! Removed properties: ST, DT, TS_PCODE, TS_MMR');
      console.log('Cleaned file saved as: township_live_cleaned.geojson');
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
