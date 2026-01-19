const fs = require('fs');

// Load the GeoJSON file
fs.readFile('geonode-mmr_rdsl_mimu_250k (1)1.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const geojsonData = JSON.parse(data);

    // Keep only id property from feature properties
    geojsonData.features.forEach(feature => {
      if (feature.properties) {
        const idValue = feature.properties.id;
        // Clear all properties
        feature.properties = {};
        // Restore only id if it existed
        if (idValue !== undefined) {
          feature.properties.id = idValue;
        }
      }
    });

    // Save the cleaned data to a new file
    fs.writeFile('geonode-mmr_rdsl_mimu_250k_cleaned.json', JSON.stringify(geojsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Cleanup complete! Kept only id property, removed all other properties');
      console.log('Cleaned file saved as: geonode-mmr_rdsl_mimu_250k_cleaned.json');
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
