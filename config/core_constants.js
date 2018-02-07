"use strict";
/*
 * Constants file: Load constants from environment variables
 *
 */

// Load required packages
const path = require('path')
  , rootPrefix = ".."
;

// Private methods for constant variables
const _private = {

  // Add properties to current config object
  define: function (name, value) {
    Object.defineProperty(exports, name, {
      value: value,
      enumerable: true
    });
  },

  // Generate absolute paths
  absolutePath: function (filePath) {
    if (!path.isAbsolute(filePath)) {
      filePath = path.join(__dirname, '/' + rootPrefix + '/' + filePath);
    }
    return filePath;
  }
};

// file path of the branded token config file.
_private.define('OST_BRANDED_TOKEN_CONFIG_FILE_PATH', _private.absolutePath("branded_tokens.json"));

// Folder path of the transfer logs
_private.define('OST_TRANSACTION_LOGS_FOLDER', _private.absolutePath("logs/"));
