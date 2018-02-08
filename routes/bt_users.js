const express = require('express')
  , router = express.Router()
  , rootPrefix = '..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response');

/* Create Ethereum address for user in utility chain */
router.post('/create', function (req, res, next) {
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
    responseHelper.error('r_t_1', 'Something went wrong').renderResponse(res)
  });
});

module.exports = router;
