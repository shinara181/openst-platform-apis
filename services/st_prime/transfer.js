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
 * @param {object} params - this is object with keys - sender - Sender Address, recipient - Recipient Address,
 *                                                amount - Amount, options: {tag: TransactionType like upvote}
 *
 * @constructor
 */
const TransferSTPrimeKlass = function(params){
  const oThis = this;

  oThis.uuid = params.uuid;
  oThis.senderAddress = params.sender;
  oThis.recipientAddress = params.recipient;
  oThis.amount = params.amount;
  oThis.options = params.options;
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

    // Get config object for given uuid
    var configObj = new getBTAddressKlass({address_type: "ERC20", uuid: oThis.uuid, full_config: 1});
    var configResponse = await configObj.perform();

    if(configResponse.isFailure()){
      return Promise.resolve(responseHelper.error("s_stp_t_2", "Invalid UUID"));
    }

    // Check if sender address is Reserve address then user reserve passphrase else user's passphrase
    var senderPassphrase = (configResponse.data["Reserve"] == oThis.senderAddress) ? configResponse.data["ReservePassphrase"] : "testtest";

    // Transfer ST Prime from sender to recipient
    var transferObj = new transferSTPKlass({sender_address: oThis.senderAddress, sender_passphrase: senderPassphrase,
      recipient_address: oThis.recipientAddress, amount_in_wei: amountInWei, options: oThis.options});

    var response = await transferObj.perform();

    return Promise.resolve(response);

  }

};

module.exports = TransferSTPrimeKlass;