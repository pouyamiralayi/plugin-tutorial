"use strict";

/**
 * DataMigration.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const fs = require("fs-extra");

module.exports = {
  /**
   * @param {string} version
   * version code, if none is defined checks if migrations folder exists.
   *
   * @returns {Promise<boolean>}
   * if directory exists
   *
   * @async
   */
  migrationExists: async version => {
    if (version) {
      return await fs.exists(`./migrations/${version}`);
    } else {
      return await fs.exists("./migrations");
    }
  },

  /**
   * @param {Array<any>} array
   * the array that should be looped through
   *
   * @param {Function} callback
   * the function to be executed for every item in the array
   *
   * @returns {Promise<void>}
   *
   * @async
   */
  forEach: async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },

  /**
   * @param {number} code
   * the HTTP status code
   *
   * @param {string} message
   * the message to be displayed
   *
   * @description
   * Creates an error object that follows the plugin norm.
   *
   * @returns {{ statusCode: number, error: string|Array<any>, message: string }}
   * returns an error object that follows the plugin norm.
   */
  makeError: (code, message) => {
    const errors = {
      200: "OK",
      201: "Created",
      304: "Not Modified",
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      406: "Not Acceptable",
      410: "Gone",
      420: "Enhance Your Calm",
      422: "Unprocessable Entity",
      429: "Too Many Requests",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout"
    };

    return {
      statusCode: code,
      error: errors[code],
      message
    };
  },
};
