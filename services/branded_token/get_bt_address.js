"use strict";

/**
 * Get Reserve address for branded token UUID
 *
 * @module services/branded_token/get_reserve_address
 */

const rootPrefix = "../.."
  , fs = require('fs')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , responseHelper = require(rootPrefix + "/lib/formatter/response")
  , coreConstants   = require( rootPrefix + '/config/core_constants' )
;

/**
 * Get Reserve address service
 *
 * @param {object} params - this is object with keys - uuid (BT UUID),
 *                      address_type (Address Type like Reserve or ERC20 contract address),
 *                      full_config (Flag for getting full config of Branded Token)
 *
 * @constructor
 */
const GetBTAddressKlass = function(params){
  const oThis = this;

  oThis.uuid = params.uuid;
  oThis.addressType = params.address_type;
  oThis.fullConfig = params.full_config;
};

GetBTAddressKlass.prototype = {

  /**
   * Perform<br><br>
   *
   * @return {promise<result>} - returns a promise which resolves to an object of kind Result
   */
  perform: async function(){
    const oThis = this;

    return new Promise(function(onResolve, onReject) {
      fs.readFile(coreConstants.OST_BRANDED_TOKEN_CONFIG_FILE_PATH, 'utf8', function (err, content) {
        if (err) {
          logger.error(err);
          return onResolve(responseHelper.error("s_bt_gra_1", err));
        } else {
          logger.info(content);
          var fileJson = JSON.parse(content);
          if (!fileJson) {
            return onResolve(responseHelper.error("s_bt_gra_2", "Cannot read file."));
          }
          var uuidConfig = fileJson[oThis.uuid];
          if(!uuidConfig || !uuidConfig[oThis.addressType]){
            return onResolve(responseHelper.error("s_bt_gra_3", oThis.addressType + " Address not found for uuid."));
          } else if(oThis.fullConfig){
            return onResolve(responseHelper.successWithData(uuidConfig));
          }

          return onResolve(responseHelper.successWithData({address: uuidConfig[oThis.addressType]}));
        }
      });
    });
  }

};

module.exports = GetBTAddressKlass;