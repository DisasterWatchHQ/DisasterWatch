const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const APP_JSON_PATH = path.join(__dirname, '../app.json');
const API_KEY = process.env.GMAPS_API_KEY;

if (!API_KEY) {
    console.error('Error: GOOGLE_MAPS_API_KEY is not defined in the .env file.');
    process.exit(1);
}

let appJson;
try {
    appJson = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf-8'));
} catch (error) {
    console.error(`Error reading app.json: ${error.message}`);
    process.exit(1);
}

appJson.android = appJson.android || {};
appJson.android.config = appJson.android.config || {};
appJson.android.config.googleMaps = appJson.android.config.googleMaps || {};
appJson.android.config.googleMaps.apiKey = API_KEY;

try {
    fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJson, null, 2), 'utf-8');
    console.log('Successfully updated app.json with the Google Maps API key.');
} catch (error) {
    console.error(`Error writing to app.json: ${error.message}`);
    process.exit(1);
}
