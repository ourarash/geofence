var defines = require("./defines");
const log = defines.log;

//-----------------------------------------------------------------------------
/**
 * Checks if the chain of
 * object[keys[0]][keys[1]]...[keys[keys.length-1]] is valid
 * @param {object} object
 * @param {...any} keys
 */
function validChain(object, ...keys) {
  if (!object) return false;
  return keys.reduce((a, b) => (a || {})[b], object) !== undefined;
}
//-----------------------------------------------------------------------------
/**
 * Creates the chain of object[keys[0]][keys[1]]...[keys[keys.length-1]]
 * @param {object} object
 * @param  {...any} keys
 */
function createChain(object, ...keys) {
  // console.log('keys: ', JSON.stringify(keys));
  if (!object) return false;
  if (!keys || !keys.length) {
    return;
  }

  if (!object[keys[0]]) {
    object[keys[0]] = {};
  }
  if (keys.length == 1) {
    return;
  }
  let key0 = keys.shift();
  return exports.createChain(object[key0], ...keys);
}
//-----------------------------------------------------------------------------
/**
 * Checks if object[keys[0]][keys[1]]...[keys[keys.length-1]] is valid
 * otherwise creates it
 * @param {*} object
 * @param  {...any} keys
 */
function validOrCreateChain(object, ...keys) {
  if (!exports.validChain(object, ...keys)) {
    exports.createChain(object, ...keys);
    return false;
  } else {
    return true;
  }
}
//-----------------------------------------------------------------------------
/**
 *
 * @param {object} obj
 */
function removeUndefinedFromObject(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object")
      this.removeUndefinedFromObject(obj[key]);
    else if (obj[key] == null) {
      delete obj[key];
    }
  });
  return obj;
}
//-----------------------------------------------------------------------------
/**
 *
 * @param {number} time
 */
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
//-----------------------------------------------------------------------------
/**
 * Formats a number with its decimal points
 * @param {number} n
 * @param {number} decimalNumbers
 */
function formatNumber(n, decimalNumbers = 4) {
  return parseFloat(n.toFixed(decimalNumbers));
}
//-----------------------------------------------------------------------------

var exports = (module.exports = {
  validChain: validChain,
  createChain: createChain,
  validOrCreateChain: validOrCreateChain,
  removeUndefinedFromObject: removeUndefinedFromObject,
  sleep: sleep,
  formatNumber: formatNumber,
});
