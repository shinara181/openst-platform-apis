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
  ;

/**
 * Get Reserve address service
 *
 * @param {object} params - this is object with keys - uuid (BT UUID), address_type (Address Type like Reserve or ERC20 contract address)
 *
 * @constructor
 */
const GetBTAddressKlass = function(params){
  const oThis = this;

  oThis.uuid = params.uuid;
  oThis.addressType = params.address_type
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
      fs.readFile('branded_tokens.json', 'utf8', function (err, content) {
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
          }

          return onResolve(responseHelper.successWithData({address: uuidConfig[oThis.addressType]}));
        }
      });
    });
  }

};

module.exports = GetBTAddressKlass;