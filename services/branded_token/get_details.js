"use strict";

/**
 * Get Details for branded token
 *
 * @module services/branded_token/get_details
 */

const rootPrefix = "../.."
  , openStPlatform = require('@openstfoundation/openst-platform')
  , openStGetTokenDetailsKlass = openStPlatform.services.utils.getBrandedTokenDetails
  ;

/**
 * Get Details service
 *
 * @param {object} params - this is object with keys - uuid (BT UUID)
 *
 * @constructor
 */
const GetDetailsKlass = function(params){
  const oThis = this;

  oThis.uuid = params.uuid;
};

GetDetailsKlass.prototype = {

  /**
   * Perform<br><br>
   *
   * @return {promise<result>} - returns a promise which resolves to an object of kind Result
   */
  perform: function(){
    const oThis = this;

    var getTokenDetailsObj = new openStGetTokenDetailsKlass({uuid: oThis.uuid});
    var response = getTokenDetailsObj.perform();

    return Promise.resolve(response);

  }

};

module.exports = GetDetailsKlass;