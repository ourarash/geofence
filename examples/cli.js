/**
 * Gets API key from command line
 */
var defines = require("../defines");
const mri = require('mri');
 
log = defines.log;
//-----------------------------------------------------------------------------
/**
 * A function that mocks the current location
 * @returns {string}
 */
async function getCurrentLocation() {
  let items = [
    "Hayward, CA",
    "San Jose, CA",
    "41.43206,-81.38992",
    "San Francisco, CA"
  ];

  // Return a random value
  var item = items[Math.floor(Math.random() * items.length)];
  return item;
}
//----------------------------------------------------------------------------- 
/**
 * Our callback function once we get inside the fence
 */
function insideGeofenceCallBack(){
  console.log("WE ARE INSIDE THE FENCE!");
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

[`apiKey`, `updateInterval`, `loopForever`, `destination`].forEach(e=>{
  if(cliArgs[e]){
    options[e] = cliArgs[e];
    log.info(`${e}: ${options[e]}`);
  }
});


var geofence = require("../index.js")(options, locationSepc);

geofence.start(options);
