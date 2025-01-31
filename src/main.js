import { v4 } from "uuid";

let webViewerName;
/**
 * @private
 * set the name of the WebViewer to use for all fetches
 * @param {string} name the Layout Object Name of the FileMaker WebViewer to callback too
 */
function setWebViewerName(name) {
  webViewerName = name;
}

/**
 * @private
 * silliness around debug and rollup
 * just trying to hack in support
 */
let _dbg = undefined;
function debug() {
  if (_dbg) return _dbg(arguments);
}
/**
 * @private
 * set your debug instance
 * @param {function} debug
 */
function setDebug(debug) {
  _dbg = debug;
}
/**
 * globalSettings
 */
export const globalSettings = {
  /**
   *
   * set the name of the WebViewer to use for all fetches
   * @param {string} name the Layout Object Name of the FileMaker WebViewer to callback too
   */
  setWebViewerName,
  /**
   * silliness around debug and rollup
   * just trying to hack in support
   * @param {function} the debug function
   */
  setDebug,
};

/**
 * Call a script in FileMaker, and get a response from the script either as a Promise or through a callback
 *
 * @param {string} scriptName the name of the script to call. The script does have to follow conventions (see docs)
 * @param {object} [parameter] optional script parameter, it can also just take a string
 * @param {function} [callback] optional callback function
 * @returns {Promise} if no callback is passed it will return a Promise
 */
export function fetch(scriptName, data, callback) {
  if (callback) {
    return _execScript(scriptName, data, callback);
  } else {
    return new Promise((resolve, reject) => {
      _execScript(scriptName, data, (result) => {
        resolve(result);
      });
    });
  }
}

const cbs = {};
window.handleFmWVFetchCallback = function (data, fetchId) {
  setTimeout(() => {
    debug("fetchId $s returning", fetchId);
    const cb = cbs[fetchId];
    delete cbs[fetchId];
    if (!cb) {
      console.error("Callback is missing for fetchId: " + fetchId);
      return;
    }
    try {
      data = JSON.parse(data);
    } catch (e) {}
    debug("result", data);
    cb(data);
  }, 1);
  return true;
};

/**
 * @private
 * @param {string} scriptName
 * @param {object} data
 * @param {function} cb
 */
function _execScript(scriptName, data, cb) {
  debug("executing script $s", scriptName);
  debug(data);
  const fetchId = v4();
  cbs[fetchId] = cb;
  const param = {
    data,
    callback: { fetchId, fn: "handleFmWVFetchCallback", webViewerName },
  };
  callFMScript(scriptName, param);
}

/**
 *  parses the api results. pretty simple, but it gets at most needs.
 * @param {*} results
 */
export function handleDataApiResponse(results) {
  const { messages, response } = results;
  const code = messages[0].code;
  if (code !== "0" && code !== "401") {
    throw new Error(`FileMaker Error Code: ${code}. ${messages[0].message}`);
  }
  let dataArray = response.data || [];

  return dataArray;
}

/**
 * calls a FileMaker Script without a callback or a promise
 * @param {string} scriptName
 * @param {object} data
 */
export function callFMScript(scriptName, data) {
  try {
    data = JSON.stringify(data);
  } catch (e) {}
  try {
    window.FileMaker.PerformScript(scriptName, data);
  } catch (e) {
    if (!window.FileMaker) {
      throw new Error(
        `Could not call script, '${scriptName}'. 'window.FileMaker' was not available at the time this function was called.`
      );
    }
    throw e;
  }
}

/**
 * calls a FileMaker Script without a callback or a promise using the new Options
 * @param {string} scriptName
 * @param {object} data
 * @param {number} optionNumber
 
 */
export function callFMScriptWithOption(scriptName, data, option) {
  try {
    data = JSON.stringify(data);
  } catch (e) {}
  try {
    window.FileMaker.PerformScriptWithOption(scriptName, data, option);
  } catch (e) {
    if (!window.FileMaker) {
      throw new Error(
        `Could not call script, '${scriptName}'. 'window.FileMaker' was not available at the time this function was called.`
      );
    }
    throw e;
  }
}
