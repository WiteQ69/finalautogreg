const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'cars.json');
const dataDir = path.dirname(dataFile);

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write empty array to cars.json
fs.writeFileSync(dataFile, JSON.stringify([], null, 2));

console.log('✅ Inventory reset successfully - cars.json is now empty');