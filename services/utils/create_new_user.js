"use strict";

/**
 * Create User in Utility chain
 *
 * @module services/users/create_new_user
 */

  const crypto = require('crypto')
  , openStPlatform = require('@openstfoundation/openst-platform')
  , openStGenerateAddressKlass = openStPlatform.services.utils.generateAddress
  ;

/**
 * Create new Ethereum address in utility chain
 *
 * @constructor
 */
const CreateUserKlass = function(){
};

CreateUserKlass.prototype = {

  /**
   * Perform<br><br>
   *
   * @return {promise<result>} - returns a promise which resolves to an object of kind Result
   */
  perform: function(){
    const oThis = this;

    var generateAddressObj = new openStGenerateAddressKlass({chain: "utility", passphrase: oThis.generateRandomPassword()});
    var response = generateAddressObj.perform();

    return Promise.resolve(response);

  },

  generateRandomPassword: function(){
    // var pwd = new Buffer(crypto.randomBytes(16));
    // return (pwd.toString('hex').slice(0, 16));
    return 'testtest'
  }

};

module.exports = CreateUserKlass;