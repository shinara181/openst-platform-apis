const express = require('express')
  , router = express.Router()
  , rootPrefix = '..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response');

/* Get details of branded token for given uuid */
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

/* Get Reserve address of branded token for given uuid */
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

/* Create Ethereum address for user in utility chain */
router.post('/users/create', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , createUserKlass = require(rootPrefix + '/services/users/create_new_user')
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

/* Get Balance of Address for given uuid */
router.get('/balanceOf', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , getBalanceKlass = require(rootPrefix + '/services/users/get_balance')
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

module.exports = router;
