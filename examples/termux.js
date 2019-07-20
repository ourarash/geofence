/**
 * Gets API key from command line
 */
var defines = require("../defines");
const mri = require('mri');
const api = require("termux");
// const NodeGeocoder = require("node-geocoder");

var log = defines.log;
// var geocoder ;

if(!api.hasTermux){
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

  log.info("current location result: ", JSON.stringify(result, null, 2));

  // let reverse = await geocoder.reverse({lat:result.latitude, lon:result.longitude})
  // .catch(function(err) {
  //   log.info(err);
  // });

  // log.info('reverse: ', JSON.stringify(reverse, null, 2));
  // log.info('reverse[0].formattedAddress: ', JSON.stringify(reverse[0].formattedAddress));
  
  return `${result.latitude},${result.longitude}`;
}
//----------------------------------------------------------------------------- 
/**
 * Our callback function once we get inside the fence
 */
async function insideGeofenceCallBack(){
  api.notification()
   .content("We are inside the geofence!")
   .id(1)
   .title('Geofencing done')
  //  .url('...')
   .run()
}
//-----------------------------------------------------------------------------
let options = {
  apiKey: "ENTER YOUR API HERE",
  updateInterval: 5,
  getCurrentLocation: getCurrentLocation,
  insideGeofenceCallBack: insideGeofenceCallBack,
  loopForever: false
};

let locationSepc = {
  destination: "Oakland, CA"
};
//-----------------------------------------------------------------------------

const argv = process.argv.slice(2);
let cliArgs = mri(argv);

[`apiKey`, `updateInterval`, `loopForever`].forEach(e=>{
  if(cliArgs[e]){
    options[e] = cliArgs[e];
    log.info(`${e}: ${options[e]}`);
  }
});


[`destination`, `mode`, `origin`].forEach(e=>{
  if(cliArgs[e]){
    locationSepc[e] = cliArgs[e];
    log.info(`${e}: ${locationSepc[e]}`);
  }
});


// geocoder = NodeGeocoder(options);


var geofence = require("../index.js")(options, locationSepc);

geofence.start(options);
