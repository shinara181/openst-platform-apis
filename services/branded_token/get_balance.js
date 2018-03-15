"use strict";

/**
 * Get Branded Token Balance from Utility chain
 *
 * @module services/branded_token/get_balance
 */

  const openStPlatform = require('@openstfoundation/openst-platform')
  , openStGetBalanceKlass = openStPlatform.services.balance.brandedToken
  , getBTAddressKlass = require('./get_bt_address')
  ;

/**
 * Get Branded Token Balance from Utility chain
 *
 * @param {object} params - this is object with keys - address (Erc20 user Address), UUID (BT UUID)
 *
 * @constructor
 */
const GetBalanceKlass = function(params){
  const oThis = this;

  oThis.uuid = params.uuid;
  oThis.address = params.address;
};

GetBalanceKlass.prototype = {

  /**
   * Perform<br><br>
   *
   * @return {promise<result>} - returns a promise which resolves to an object of kind Result
   */
  perform: async function(){
    const oThis = this;

    var addressObj = new getBTAddressKlass({address_type: "ERC20", uuid: oThis.uuid});
    var contractAddressResponse = await addressObj.perform();

    if(contractAddressResponse.isFailure()){
      return Promise.resolve(contractAddressResponse);
    }
    var contractAddress = contractAddressResponse.data.address;

    var getBalanceObj = new openStGetBalanceKlass({erc20_address: contractAddress, address: oThis.address});
    var response = await getBalanceObj.perform();

    return Promise.resolve(response);

  }

};

module.exports = GetBalanceKlass;