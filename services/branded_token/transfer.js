"use strict";

/**
 * Transfer Branded Token in Utility Chain
 *
 * @module services/branded_token/transfer
 */

  const openStPlatform = require('@openstfoundation/openst-platform')
  , BigNumber = require('bignumber.js')
  , transferBTKlass = openStPlatform.services.transaction.transfer.brandedToken
  ;

  const rootPrefix = "../.."
  , getBTAddressKlass = require(rootPrefix + '/services/branded_token/get_bt_address')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , responseHelper = require(rootPrefix + "/lib/formatter/response")
  ;

/**
 * Transfer BT from sender to recipient for a given UUID in utility chain
 *
 * @param {object} params - this is object with keys - sender - Sender Address, recipient - Recipient Address, amount - Amount, UUID (BT UUID)
 *
 * @constructor
 */
const TransferBTKlass = function(params){
  const oThis = this;

  oThis.uuid = params.uuid;
  oThis.senderAddress = params.sender;
  oThis.recipientAddress = params.recipient;
  oThis.amount = params.amount;
};

TransferBTKlass.prototype = {

  /**
   * Perform<br><br>
   *
   * @return {promise<result>} - returns a promise which resolves to an object of kind Result
   */
  perform: async function(){
    const oThis = this;

    // Check if amount is a valid number
    if(isNaN(oThis.amount)){
      return Promise.resolve(responseHelper.error("s_bt_t_1", "Invalid amount"));
    }

    // Convert amount in wei
    var amountInWei = new BigNumber(oThis.amount).mul((new BigNumber(10)).pow(18));
    console.log(amountInWei);

    // Get config object for given uuid
    var configObj = new getBTAddressKlass({address_type: "ERC20", uuid: oThis.uuid});
    var configResponse = await configObj.perform();

    if(configResponse.isFailure()){
      return Promise.resolve(responseHelper.error("s_bt_t_2", "Invalid UUID"));
    }

    // Transfer branded token from sender to recipient
    var transferObj = new transferBTKlass({erc20_address: configResponse.data.address,
      sender_address: oThis.senderAddress, sender_passphrase: 'testtest',
      recipient_address: oThis.recipientAddress, amount_in_wei: amountInWei});

    var response = await transferObj.perform();

    return Promise.resolve(response);

  }

};

module.exports = TransferBTKlass;