# Geofence

Simple geofencing using Google or other geolocation providers's API

[![NPM](https://badge.fury.io/js/geofence.svg)](https://www.npmjs.com/package/geofence)

- [x] Check the current locations distance/duration againts the destination
- [x] Accepts callbacks for finding current location
- [x] Accepts callbacks for when inside the fence

# Installation

Install with npm:

```bash
npm install geofence --save
```

# Usage

```javascript
let options = {
  // You can get it from here: https://cloud.google.com/maps-platform/
  apiKey: "ENTER YOUR API HERE", // Enter your own api key
  updateInterval: 5,  // Update current location (in seconds)
  getCurrentLocation: getCurrentLocation, // API function to get the current location 
  insideGeofenceCallBack: insideGeofenceCallBack, // Callback for when we are inside the fence
  loopForever: false  // Stop/continue once we are inside the fence
};

let locationSepc = {
  destination: "Oakland, CA"
};
//-----------------------------------------------------------------------------
var geofence = require("./index.js")(options, locationSepc);

geofence.start(options);
```

# Example
See [example.js](example.js)