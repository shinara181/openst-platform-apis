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

module.exports = router;
