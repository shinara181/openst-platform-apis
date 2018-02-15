"use strict";

/**
 * Get ST Prime Balance from Utility chain
 *
 * @module services/users/get_stprime_balance
 */

  const openStPlatform = require('@openstfoundation/openst-platform')
  , openStGetStPrimeBalanceKlass = openStPlatform.services.balance.simpleTokenPrime
  ;

/**
 * Get ST Prime Balance from Utility chain
 *
 * @param {object} params - this is object with keys - address (Erc20 user Address)
 *
 * @constructor
 */
const GetStPrimeBalanceKlass = function(params){
  const oThis = this;

  oThis.address = params.address;
};

GetStPrimeBalanceKlass.prototype = {

  /**
   * Perform<br><br>
   *
   * @return {promise<result>} - returns a promise which resolves to an object of kind Result
   */
  perform: async function(){
    const oThis = this;

    var getBalanceObj = new openStGetStPrimeBalanceKlass({address: oThis.address});
    var response = await getBalanceObj.perform();

    return Promise.resolve(response);

  }

};

module.exports = GetStPrimeBalanceKlass;