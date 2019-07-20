var utility_functions = require("./utility");
var defines = require("./defines");
const moment = require("moment");
var log = defines.log;
var googleMapsClient;

//-----------------------------------------------------------------------------
/**
 *
 * @param {String} origin
 * @param {String} destination
 * @param {String} mode
 */
async function getDistance(origin, destination, mode) {
  let result;
  try {
    let response = await googleMapsClient
      .distanceMatrix({
        origins: [origin],
        destinations: [destination],
        mode: mode
      })
      .asPromise();

    result = {
      distance: response.json.rows[0].elements[0],
      origin_address: response.json.origin_addresses[0],
      destination_address: response.json.destination_addresses[0]
    };
  } catch (error) {
    log.error("Error: ", error);
  }

  return result;
}
//-----------------------------------------------------------------------------
/**
 * Updates the distance
 */
async function updateDistance() {
  let curLocation;
  let result;
  try {
    curLocation = await defines.Globals.options.getCurrentLocation();

    let now = moment().valueOf();
    let minutesBeforeNow =
      now -
      1000 * 1 * 60 * defines.Globals.options.locationCacheTimeoutInMinutes;

    if (
      defines.cache.distance[curLocation] &&
      defines.cache.distance[curLocation].value &&
      defines.cache.distance[curLocation].timestamp >= minutesBeforeNow
    ) {
      // Usae cache
      result = defines.cache.distance[curLocation].value;
      log.info("Used cache!");
    } else {
      // Call google API
      result = await getDistance(
        curLocation,
        defines.Globals.locationSpecs.destination,
        defines.Globals.locationSpecs.mode
      );

      // Update cashe
      defines.cache.distance[curLocation] = {
        value: result,
        timestamp: now
      };
    }
  } catch (error) {
    log.error("Error: ", error);

  }
  
  // Call updateDistanceResults
  if (defines.Globals.options.updateDistanceCallBack) {
    let updateDistanceResults={
      curAddress: result.origin_address,
      destAddress: result.destination_address,
      mode: defines.Globals.locationSpecs.mode,
      curDistance: result.distance.distance,
      curDuration: result.distance.duration,
      activateFenceOn:defines.Globals.options.activateFenceOn,
      fenceDurationValue:defines.Globals.options.fenceDurationValue,
      fenceDistanceValue:defines.Globals.options.fenceDistanceValue,
    }
    defines.Globals.options.updateDistanceCallBack(updateDistanceResults);
  }

  log.info("Cur address:", result.origin_address);
  log.info("Dest address:", result.destination_address);
  log.info("Mode: ", defines.Globals.locationSpecs.mode);
  log.info("cur distance: ", JSON.stringify(result.distance.distance.text));
  log.info("cur duration: ", JSON.stringify(result.distance.duration.text));

  let insideFence = false;
  if (
    result.distance.duration &&
    ["duration", "both", "either"].includes(defines.Globals.options.activateFenceOn) &&
    result.distance.duration.value <= defines.Globals.options.fenceDurationValue
  ) {
    log.info(
      "Inside the fence based on duration: ",
      `${result.distance.duration.value} <= ${
        defines.Globals.options.fenceDurationValue
      }`
    );
    insideFence = true;
  }

  if (
    result.distance.distance &&
    ["distance", "both", "either"].includes(defines.Globals.options.activateFenceOn) &&
    result.distance.distance.value <= defines.Globals.options.fenceDistanceValue
  ) {
    log.info(
      "Inside fence based on distance: ",
      `${result.distance.distance.value} <= ${
        defines.Globals.options.fenceDistanceValue
      }`
    );
    insideFence = true;
  }

  if (insideFence) {
    log.info("We are inside the fence!".green);
    if (defines.Globals.options.insideGeofenceCallBack) {
      defines.Globals.options.insideGeofenceCallBack();
    }
    if (!defines.Globals.options.loopForever) {
      stop("Ending geofencing.");
    }
  } else {
    log.info("We are NOT inside the fence!".red);
  }
  log.info(
    "-----------------------------------------------------------------------------"
  );
}
//-----------------------------------------------------------------------------
async function main() {
  defines.Globals.intervals.aggregatePriceInterval = setInterval(() => {
    if (defines.Globals.options.enable) {
      updateDistance();
    }
  }, defines.Globals.options.updateInterval * 1000);
}
//-----------------------------------------------------------------------------
/**
 * Starts geofencing
 */
async function start() {
  log.info("Start geofencing...");
  defines.Globals.options.enable = true;
  await main();
}
//-----------------------------------------------------------------------------
/**
 * Stops geofencing
 * @param {String} message
 */
function stop(message = "Stop signal received. Please wait...") {
  log.info(message);
  defines.Globals.options.enable = false;
  process.exit();
}
//-----------------------------------------------------------------------------
module.exports = function(
  options = {},
  locationSpecs = defines.Globals.locationSpecs
) {
  Object.assign(defines.Globals.options, options);
  Object.assign(defines.Globals.locationSpecs, locationSpecs);

  googleMapsClient = require("@google/maps").createClient({
    key: defines.Globals.options.apiKey,
    Promise: Promise
  });

  return {
    stop: stop,
    start: start
  };
};
