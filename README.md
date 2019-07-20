# Geofence

Simple geofencing using Google or other geolocation providers's API

[![NPM](https://badge.fury.io/js/geofence.svg)](https://www.npmjs.com/package/geofence)

- [x] Check the current location's distance/duration againts the destination
- [x] Caches the distances to reduce geolocation API calls
- [x] Accepts callbacks for finding current location
- [x] Accepts callbacks for when inside the fence

# Installation

Install with npm:

```bash
npm install geofence --save
```

# Usage

The current location and destination can be address or lat/long. See [Google's Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/intro)

```javascript

let options = {
  // You can get it from here: https://cloud.google.com/maps-platform/
  apiKey: "ENTER YOUR API HERE", // Enter your own api key
  updateInterval: 5,  // Update current location (in seconds)

  // API function to get the current location.
  // It should return a string that is an address or lat/long
  // See Google's Distance Matrix API:
  // https://developers.google.com/maps/documentation/distance-matrix/intro
  getCurrentLocation: getCurrentLocation,

  // Callback for when we are inside the fence (optional)
  insideGeofenceCallBack: insideGeofenceCallBack,

  // Callback function to be called whenever the 
  // current location and distance is updated (optional)
  updateDistanceCallBack: updateDistanceCallBack,

  loopForever: false,  // Stop/continue once we are inside the fence

  activateFenceOn: "duration", // 'duration' OR 'distance' OR 'either'
  fenceDurationValue: 25 * 60, // range of the fence in seconds
  fenceDistanceValue: 1000, // range of the fence in meters
};

let locationSepc = {
  destination: "Oakland, CA", // Can be address or lat/long
  mode: "driving" //
};
//-----------------------------------------------------------------------------
var geofence = require("./index.js")(options, locationSepc);

geofence.start(options);
```

# Examples

- [examples/example.js](examples/example.js): Simple example
- [examples/cli.js](examples/cli.js): demonstrates running with command line arguments:
  - `node cli.js --apiKey=YOUR_API_KEY --destination="San Francisco, CA"`
- [examples/termux.js](examples/termux.js): demonstrates running inside [Termux](https://termux.com/) and [Termux-API](https://play.google.com/store/apps/details?id=com.termux.api) on Android using device GPS and system notifications. Run with:
  - `node termux.js --apiKey=YOUR_API_KEY --destination="320 Main St, Venice, CA" --fenceDurationValue=5 --updateInterval=10`
