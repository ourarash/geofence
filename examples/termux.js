/**
 * Should be run inside [Termux](https://termux.com/) in Android using GPS
 * First install the following apps: 
 *  - https://play.google.com/store/apps/details?id=com.termux
 *  - https://play.google.com/store/apps/details?id=com.termux.api
 */

var defines = require("../defines");
const mri = require("mri");
const api = require("termux");

var log = defines.log;

if (!api.hasTermux) {
  log.error("Termux doesn't exits. Exit!");
}

//-----------------------------------------------------------------------------
/**
 * A function that mocks the current location
 * @returns {string}
 */
async function getCurrentLocation() {
  let result = await api
    .location()
    .provider("gps") // network/passive/gps (default)
    .request("last") // updates/last/once (default)
    .run();

  // log.info("current location result: ", JSON.stringify(result, null, 2));

  return `${result.latitude},${result.longitude}`;
}
//-----------------------------------------------------------------------------
/**
 * Our callback function once we get inside the fence
 */
async function insideGeofenceCallBack() {
  api
    .notification()
    .content("We are inside the geofence!")
    .id(1)
    .title("Geofencing done")
    //  .url('...')
    .run();
}
//-----------------------------------------------------------------------------
/**
 * Callback function to be called whenever the current location and distance
 * is updated
 * @param {Objecgt} updateDistanceResults
 */
async function updateDistanceCallBack(updateDistanceResults) {
  let notificationTitle = `
  curDistance: ${updateDistanceResults.curDistance.text},
  curDuration: ${updateDistanceResults.curDuration.text}`;

  let notificationText = `Activate on:
  ${updateDistanceResults.activateFenceOn},
  duration:${updateDistanceResults.fenceDurationValue},
  distance:${updateDistanceResults.fenceDistanceValue}
  `;
  api
    .notification()
    .content(notificationText)
    .id(1)
    .title(notificationTitle)
    //  .url('...')
    .run();
}
//-----------------------------------------------------------------------------
let options = {
  apiKey: "ENTER YOUR API HERE",
  updateInterval: 5,
  getCurrentLocation: getCurrentLocation,
  insideGeofenceCallBack: insideGeofenceCallBack,
  updateDistanceCallBack: updateDistanceCallBack,
  loopForever: true,

  activateFenceOn: "duration", // 'duration', 'distance', 'either'
  fenceDurationValue: 25 * 60, // range of the fence in seconds
  fenceDistanceValue: 1000 // range of the fence in meter
};

let locationSepc = {
  destination: "Oakland, CA"
};
//-----------------------------------------------------------------------------

const argv = process.argv.slice(2);
let cliArgs = mri(argv);

[
  `apiKey`,
  `updateInterval`,
  `loopForever`,
  `fenceDurationValue`,
  `fenceDistanceValue`
].forEach(e => {
  if (cliArgs[e]) {
    options[e] = cliArgs[e];
    log.info(`${e}: ${options[e]}`);
  }
});

[`destination`, `mode`, `origin`].forEach(e => {
  if (cliArgs[e]) {
    locationSepc[e] = cliArgs[e];
    log.info(`${e}: ${locationSepc[e]}`);
  }
});

var geofence = require("../index.js")(options, locationSepc);

geofence.start(options);
