"use strict";

/**
 * Get Transaction logs in Utility chain
 *
 * @module services/utils/get_transaction_logs
 */

  const openStPlatform = require('../../../openst-platform/index')
  , getTransactionReceiptKlass = openStPlatform.services.transaction.getTransactionReceipt
  ;

/**
 * Get Transaction Recipt from transaction hash in utility chain
 *
 * @param {object} params - this is object with keys - transaction_hash Transaction hash to look up in utility chain
 *
 * @constructor
 */
const GetTransactionLogsKlass = function(params){
  const oThis = this;

  oThis.transactionHash = params.transaction_hash;
};

GetTransactionLogsKlass.prototype = {

  /**
   * Perform<br><br>
   *
   * @return {promise<result>} - returns a promise which resolves to an object of kind Result
   */
  perform: async function(){
    const oThis = this;


    var getTrxObj = new getTransactionReceiptKlass({chain: "utility", transaction_hash: oThis.transactionHash});
    var response = await getTrxObj.perform();

    return Promise.resolve(response);

  }

};

module.exports = GetTransactionLogsKlass;