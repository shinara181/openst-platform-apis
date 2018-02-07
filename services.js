"use strict";
/**
 * openST Platform Services
 *
 * @module services
 */

const shellAsyncCmd = require('node-cmd')
  , openStPlatformObj = require('@openstfoundation/openst-platform')
  , utilServices = openStPlatformObj.services.utils
  , Path = require('path')
;

// load shelljs and disable output
var shell = require('shelljs');
shell.config.silent = true;

const rootPrefix = "."
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;

/**
 * Constructor for services
 *
 * @constructor
 */
const ServicesKlass = function () {};

ServicesKlass.prototype = {
  /**
   * Start all platform services
   */
  startServices: async function () {
    const oThis = this
      , servicesList = [];

    // Start Value Chain
    logger.step("** Start value chain");
    var cmd = "sh " + oThis._setupFolderAbsolutePath() + "/openst-geth-v/run.sh";
    servicesList.push(cmd);
    oThis._asyncCommand(cmd);

    // Start Utility Chain
    logger.step("** Start utility chain");
    var cmd = "sh " + oThis._setupFolderAbsolutePath() + "/openst-geth-u/run.sh";
    servicesList.push(cmd);
    oThis._asyncCommand(cmd);

    // Check geths are up and running
    logger.step("** Check chains are up and responding");
    const statusObj = new utilServices.platformStatus()
      , servicesResponse = await statusObj.perform();
    if (servicesResponse.isFailure()) {
      logger.error("* Error ", servicesResponse);
      process.exit(1);
    } else {
      logger.info("* Value Chain:", servicesResponse.data.chain.value, "Utility Chain:", servicesResponse.data.chain.utility);
    }

    // Start intercom processes in openST env
    logger.step("** Start stake and mint inter-communication process");
    var cmd = "node " + oThis._platformAbsolutePath() + "/executables/inter_comm/stake_and_mint.js";
    servicesList.push(cmd);
    oThis._asyncCommand(cmd);

    logger.step("** Start redeem and unstake inter-communication process");
    var cmd = "node " + oThis._platformAbsolutePath() + "/executables/inter_comm/redeem_and_unstake.js";
    servicesList.push(cmd);
    oThis._asyncCommand(cmd);

    logger.step("** Start register branded token inter-communication process");
    var cmd = "node " + oThis._platformAbsolutePath() + "/executables/inter_comm/register_branded_token.js";
    servicesList.push(cmd);
    oThis._asyncCommand(cmd);

    // Start intercom processes in OST env
    logger.step("** Start stake and mint processor");
    var cmd = "node " + oThis._platformAbsolutePath() + "/executables/inter_comm/stake_and_mint_processor.js";
    servicesList.push(cmd);
    oThis._asyncCommand(cmd);

    logger.step("** Start redeem and unstake processor");
    var cmd = "node " + oThis._platformAbsolutePath() + "/executables/inter_comm/redeem_and_unstake_processor.js";
    servicesList.push(cmd);
    oThis._asyncCommand(cmd);

    logger.win("\n** Congratulation! All services are up and running. \n" +
      "NOTE: We will keep monitoring the services, and notify you if any service stops.");

    // Check all services are running
    oThis._uptime(servicesList);
  },

  /**
   * Run async command
   *
   * @params {string} cmd - command to start the service
   * @private
   */
  _asyncCommand: function(cmd) {
    const oThis = this
    ;
    logger.info(cmd);
    shellAsyncCmd.run(cmd);
  },

  /**
   * get the setup folder absolute path
   *
   * @return {string}
   * @private
   */
  _setupFolderAbsolutePath: function() {
    return Path.resolve("./") + "/openst-setup";
  },

  /**
   * get the setup folder absolute path
   *
   * @return {string}
   * @private
   */
  _platformAbsolutePath: function() {
    return Path.resolve("./") + "/node_modules/@openstfoundation/openst-platform";
  },

  /**
   * Check if all services are up and running
   *
   * @params {array} cmds - Array of all running service commands
   * @private
   */
  _uptime: function (cmds) {
    setInterval(function () {
      for (var i=0; i < cmds.length; i++) {
        var processID = shell.exec("ps -ef | grep '" + cmds[i] + "' | grep -v grep | awk '{print $2}'").stdout;
        if (processID == "") {
          logger.error("* Process stopped:", cmds[i], " Please restart the services.");
        }
      }
    }, 5000);
  }
};

const services = new ServicesKlass();
services.startServices();
