const express = require('express')
  , router = express.Router()
  , rootPrefix = '..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Branded Token routes.<br><br>
 * Base url for all routes given below is: <b>base_url = /bt/</b>
 *
 * @module routes/branded_token
 */


/**
 * Get details of branded token for given uuid
 *
 * @name Branded Token Details
 *
 * @route {GET} {base_url}/details
 *
 * @routeparam {String} :uuid - Branded Token UUID
 */
router.get('/details', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , getDetailsKlass = require(rootPrefix + '/services/branded_token/get_details')
      , getDetails = new getDetailsKlass(decodedParams)
    ;

    console.log("decodedParams--", decodedParams);

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return getDetails.perform()
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_1', 'Something went wrong').renderResponse(res)
  });
});

/**
 * Get Reserve address of branded token for given uuid
 *
 * @name Branded Token Reserve Address
 *
 * @route {GET} {base_url}/reserve
 *
 * @routeparam {String} :uuid - Branded Token UUID
 */
router.get('/reserve', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , getDetailsKlass = require(rootPrefix + '/services/branded_token/get_bt_address')
    ;

    decodedParams["address_type"] = "Reserve";
    const getDetails = new getDetailsKlass(decodedParams);

    console.log("decodedParams--", decodedParams);

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return getDetails.perform()
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_2', 'Something went wrong').renderResponse(res)
  });
});

/**
 * Create Ethereum address for user in utility chain
 *
 * @name Create User on Utility chain
 *
 * @route {POST} {base_url}/users/create
 *
 */
router.post('/users/create', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , createUserKlass = require(rootPrefix + '/services/utils/create_new_user')
      , createUserObj = new createUserKlass()
    ;

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return createUserObj.perform()
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_3', 'Something went wrong').renderResponse(res)
  });
});

/**
 * Get Balance of Address for given Branded Token uuid
 *
 * @name Branded Token User Balance
 *
 * @route {GET} {base_url}/balanceOf
 *
 * @routeparam {String} :uuid - Branded Token UUID
 * @routeparam {String} :address - User ERC20 Address
 */
router.get('/balanceOf', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , getBalanceKlass = require(rootPrefix + '/services/branded_token/get_balance')
      , getDetails = new getBalanceKlass(decodedParams)
    ;

    console.log("decodedParams--", decodedParams);

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return getDetails.perform()
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_4', 'Something went wrong').renderResponse(res)
  });
});

/**
 * Get Gas Balance of Address
 *
 * @name User Gas Balance
 *
 * @route {GET} {base_url}/gas-balance
 *
 * @routeparam {String} :address - User ERC20 Address
 */
router.get('/gas-balance', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , getBalanceKlass = require(rootPrefix + '/services/st_prime/get_balance')
      , getDetails = new getBalanceKlass(decodedParams)
    ;

    console.log("decodedParams--", decodedParams);

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return getDetails.perform()
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_5', 'Something went wrong').renderResponse(res)
  });
});

/**
 * Get Transaction Logs for given Transaction Hash
 *
 * @name Transaction Logs
 *
 * @route {GET} {base_url}/logs
 *
 * @routeparam {String} :transaction_hash - Transaction Hash for lookup
 */
router.get('/logs', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , getTrxKlass = require(rootPrefix + '/services/utils/get_transaction_logs')
      , getDetails = new getTrxKlass(decodedParams)
    ;

    console.log("decodedParams--", decodedParams);

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return getDetails.perform()
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_6', 'Something went wrong').renderResponse(res)
  });
});

/**
 * Transfer Amount from sender address to receiver address for a given branded token UUID
 *
 * @name Transfer Amount
 *
 * @route {POST} {base_url}/transfer
 *
 * @routeparam {String} :uuid - Branded Token UUID
 * @routeparam {String} :sender - Sender ERC20 Address
 * @routeparam {String} :recipient - Recipient ERC20 Address
 * @routeparam {Integer} :amount - Amount of Branded Token to transfer
 */
router.post('/transfer', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , transferBTKlass = require(rootPrefix + '/services/branded_token/transfer')
      , transferObj = new transferBTKlass(decodedParams)
    ;

    console.log("decodedParams--", decodedParams);

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return transferObj.perform()
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_7', 'Something went wrong').renderResponse(res)
  });
});

/**
 * Transfer Gas amount from sender address to receiver address for a given branded token UUID
 *
 * @name Transfer Gas
 *
 * @route {POST} {base_url}/transfer-gas
 *
 * @routeparam {String} :uuid - Branded Token UUID
 * @routeparam {String} :sender - Sender ERC20 Address
 * @routeparam {String} :recipient - Recipient ERC20 Address
 * @routeparam {Integer} :amount - Amount of Branded Token to transfer
 */
router.post('/transfer-gas', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , transferBTKlass = require(rootPrefix + '/services/st_prime/transfer')
      , transferObj = new transferBTKlass(decodedParams)
    ;

    console.log("decodedParams--", decodedParams);

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return transferObj.perform()
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_7', 'Something went wrong').renderResponse(res)
  });
});

module.exports = router;
