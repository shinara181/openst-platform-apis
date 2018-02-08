"use strict";

/**
 * Transfer ST Prime in Utility Chain
 *
 * @module services/st_prime/transfer
 */

  const openStPlatform = require('@openstfoundation/openst-platform')
  , BigNumber = require('bignumber.js')
  , transferSTPKlass = openStPlatform.services.transaction.transfer.simpleTokenPrime
  ;

  const rootPrefix = "../.."
  , getBTAddressKlass = require(rootPrefix + '/services/branded_token/get_bt_address')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , responseHelper = require(rootPrefix + "/lib/formatter/response")
  ;

/**
 * Transfer ST Prime from sender to recipient for a given UUID in utility chain
 *
 * @param {object} params - this is object with keys - sender - Sender Address, recipient - Recipient Address, amount - Amount
 *
 * @constructor
 */
const TransferSTPrimeKlass = function(params){
  const oThis = this;

  oThis.senderAddress = params.sender;
  oThis.recipientAddress = params.recipient;
  oThis.amount = params.amount;
};

TransferSTPrimeKlass.prototype = {

  /**
   * Perform<br><br>
   *
   * @return {promise<result>} - returns a promise which resolves to an object of kind Result
   */
  perform: async function(){
    const oThis = this;

    // Check if amount is a valid number
    if(isNaN(oThis.amount)){
      return Promise.resolve(responseHelper.error("s_stp_t_1", "Invalid amount"));
    }

    // Convert amount in wei
    var amountInWei = new BigNumber(oThis.amount).mul((new BigNumber(10)).pow(18));

    // Transfer ST Prime from sender to recipient
    var transferObj = new transferSTPKlass({sender_address: oThis.senderAddress, sender_passphrase: 'testtest',
      recipient_address: oThis.recipientAddress, amount_in_wei: amountInWei});

    var response = await transferObj.perform();

    return Promise.resolve(response);

  }

};

module.exports = TransferSTPrimeKlass;