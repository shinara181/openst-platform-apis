"use strict";
/**
 * Register Branded Token
 *
 * @module register_bt
 */

const openStPlatformObj = require('@openstfoundation/openst-platform')
  , onBoardingServices = openStPlatformObj.services.onBoarding
  , utilServices = openStPlatformObj.services.utils
  , Path = require('path')
;

const rootPrefix = "."
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;

/**
 * Constructor for proposing branded token
 *
 * @constructor
 */
const RegisterBTKlass = function () {
  const oThis = this;

  this.reserveAddress = ''; // Member company address (will be generated and populated)
  this.reservePassphrase = 'acmeOnopenST'; // Member company address passphrase
  this.btName = "Acme Coin4"; // branded token name
  this.btSymbol = "ACME4"; // branded token symbol
  this.btConversionRate = "10"; // branded token to OST conversion rate, 1 OST = 10 ACME
};

RegisterBTKlass.prototype = {
  /**
   * Start BT proposal
   */
  start: async function () {
    const oThis = this;

    // Generate reserve address
    logger.step("** Generating reserve address");
    var addressRes = await oThis._generateAddress();
    oThis.reserveAddress = addressRes.data.address;
    logger.info("* address:", oThis.reserveAddress);

    // Start the BT proposal
    var proposeRes = await oThis._propose();

    // Monitor the BT proposal response
    var statusRes = await oThis._checkProposeStatus(proposeRes.data.transaction_hash);

  },

  /**
   * Generate reserve address
   *
   * @return {promise<result>}
   * @private
   */
  _generateAddress: async function() {
    const oThis = this
    ;
    const addressObj = new utilServices.generateAddress({chain: 'utility', passphrase: this.reservePassphrase})
      , addressResponse = await addressObj.perform();
    if (addressResponse.isFailure()) {
      logger.error("* Reserve address generation failed with error:", addressResponse);
      process.exit(1);
    }
    return Promise.resolve(addressResponse);
  },

  /**
   * Start the proposal of branded token
   *
   * @return {promise<result>}
   * @private
   */
  _propose: async function() {
    const oThis = this
    ;
    logger.step("** Starting BT proposal");
    logger.info("* Name:", oThis.btName, "Symbol:", oThis.btSymbol, "Conversion Rate:", oThis.btConversionRate);
    const proposeBTObj = new onBoardingServices.proposeBrandedToken(
      {name: oThis.btName, symbol: oThis.btSymbol, conversion_rate: oThis.btConversionRate}
    );
    const proposeBTResponse = await proposeBTObj.perform();
    if (proposeBTResponse.isFailure()) {
      logger.error("* Proposal failed with error:", proposeBTResponse);
      process.exit(1);
    }
    return Promise.resolve(proposeBTResponse);
  },

  /**
   * Check propose status
   *
   * @param {string} transaction_hash - BT proposal transaction hash
   * @return {promise<result>}
   * @private
   *
   */
  _checkProposeStatus: function(transaction_hash) {
    const oThis = this
      , timeInterval = 1000
    ;
    logger.step("** Monitoring BT proposal status");
    const statusObj = new onBoardingServices.getRegistrationStatus({transaction_hash: transaction_hash});
    var statusTimer = setInterval(async function () {
      var statusResponse = await statusObj.perform();
      if (statusResponse.isFailure()) {
        logger.error(statusResponse);
        clearInterval(statusTimer);
        process.exit(1);
      } else {
        logger.info(statusResponse);
      }
    }, timeInterval);
  }
};

const services = new RegisterBTKlass();
services.start();
