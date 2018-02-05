const Assert  = require("assert")
  , Express   = require("express")
  , RP        = require("request")
  , BigNumber = require("bignumber.js")
;

const reqPrefix         = ".."
  , openStPlatformKlass = require('@openstfoundation/openst-platform')
  , openStPlatform = new openStPlatformKlass
  , BTContractInteract  = openStPlatform.contracts.brandedToken
  , TransactionLogger = openStPlatform.helpers.transactionLogger
  , responseHelper      = require(reqPrefix + "/lib/formatter/response")
  , logger = require(reqPrefix + '/helpers/custom_console_logger')
;

/** Construct a new route for a specific BT.
 * @param {object} erc20 The ERC20 token to manage.
 * @param {string} callbackUrl The callback URL for confirmed transactions.
 * @param {object?} callbackAuth Optional authentication object for callback requests.
 */
module.exports = function( member ) {
  const btContractInteract  = new BTContractInteract( member )
    , callbackUrl           = member.Callback
    , callbackAuth          = member.CallbackAuth
    , memberSymbol          = member.Symbol
  ;

  const router = Express.Router();

  // Convert base unit to Wei
  function toWei( stringValue ) {
    var value = Number( stringValue );
    Assert.strictEqual( isNaN( value ), false, `value must be of type 'Number'`);

    if ( typeof stringValue != 'string' ) {
      stringValue = String( stringValue );
    }

    return new BigNumber(stringValue).mul((new BigNumber(10)).pow(18));
  }

  // Convert Wei to base unit
  function fromWei( stringValue ) {
    if ( typeof stringValue != 'string' ) {
      stringValue = String( stringValue );
    }
    return new BigNumber(stringValue).div((new BigNumber(10)).pow(18));
  }

  // Log request start line
  function appendRequestInfo(req) {
    logger.requestStartLog(req.url);
  }

  // Index Route
  router.get('/', function(req, res, next) {
    const rootResponse = responseHelper.successWithData({});
    rootResponse.renderResponse( res );
  });

  // Get reserve address
  router.get('/reserve', function(req, res, next) {
    appendRequestInfo(req);
    btContractInteract.getReserve()
      .then( response => {
        response.renderResponse( res );
      })
      .catch(next);
  });

  // Get token name
  router.get('/name', function(req, res, next) {
    appendRequestInfo(req);
    btContractInteract.getName()
      .then( response => {
        logger.info( "then.response", JSON.stringify( response ) );
        response.renderResponse( res );
      })
      .catch( reason => {
        logger.info( "catch.reason", reason.message );
        throw reason;
      })
      .catch(next);
  });

  // Get reserve uuid
  router.get('/uuid', function(req, res, next) {
    appendRequestInfo(req);
    btContractInteract.getUuid()
      .then( response => {
        logger.info( "then.response", JSON.stringify( response ) );
        response.renderResponse( res );
      })
      .catch( reason => {
        logger.info( "catch.reason", reason.message );
        throw reason;
      })
      .catch(next);
  });

  // Get token symbol
  router.get('/symbol', function(req, res, next) {
    appendRequestInfo(req);
    btContractInteract.getSymbol()
      .then( response => {
        response.renderResponse( res );
      })
      .catch(next);
  });

  // Get token decimal precision
  router.get('/decimals', function(req, res, next) {
    appendRequestInfo(req);
    btContractInteract.getDecimals()
      .then( response => {
        response.renderResponse( res );
      })
      .catch(next);
  });

  // Get token total supply
  router.get('/totalSupply', function(req, res, next) {
    appendRequestInfo(req);
    btContractInteract.getTotalSupply()
      .then( response => {
        if ( response && response.data && response.data.totalSupply ) {
          response.data.totalSupply = fromWei( response.data.totalSupply);
          response.data.unit = memberSymbol;
        }
        response.renderResponse( res ); 
      })
      .catch(next);
  });

  // Get token balance of a address
  router.get('/balanceOf', function(req, res, next) {
    appendRequestInfo(req);
    const owner = req.query.owner;

    btContractInteract.getBalanceOf(owner)
      .then( response => {
        if ( response && response.data && response.data.balance ) {
          response.data.balance = fromWei( response.data.balance, "ether" );
          response.data.unit = memberSymbol;
          response.data.owner = owner;
        }
        response.renderResponse( res );
      })
      .catch(next);
  });

  // Add new key for given token
  router.get('/newkey', function(req, res, next) {
    appendRequestInfo(req);
    btContractInteract.newUserAccount()
      .then( response => {
        response.renderResponse( res );
      })
      .catch(next);
    //
  });

  // Transfer token from address to address
  router.get('/transfer', function(req, res, next) {
    appendRequestInfo(req);
    const sender = req.query.sender;
    const recipient = req.query.to;
    const amount = String(req.query.value);
    const tag = req.query.tag || "transfer";

    const amountInWei = toWei( amount );

    btContractInteract.transfer(sender, recipient, amountInWei, tag)
      .then( response => {
        if ( response && response.data && response.data.amount ) {
          response.data.amount = fromWei( response.data.amount, "ether" );
          response.data.unit = memberSymbol;
        }
        response.renderResponse( res );
      })
      .catch(next)
    ;
  });

  router.get('/transaction-logs', function(req, res, next) {
    appendRequestInfo(req);
    const transactionUUID = req.query.transactionUUID;

    new Promise( (resolve, reject) => {
      TransactionLogger.getTransactionLogs(memberSymbol, transactionUUID, resolve);
  })
  .then( response => {
      response.renderResponse( res );
  })
  .catch(next)
    ;
  });

  router.get('/failed-transactions', function(req, res, next) {
    appendRequestInfo(req);
    new Promise( (resolve, reject) => {
      TransactionLogger.getFailedTransactions(memberSymbol, resolve);
  })
  .then( response => {
      response.renderResponse( res );
  })
  .catch(next)
    ;
  });

  router.get('/pending-transactions', function(req, res, next) {
    appendRequestInfo(req);
    new Promise( (resolve, reject) => {
      TransactionLogger.getPendingTransactions(memberSymbol, resolve);
  })
  .then( response => {
      response.renderResponse( res );
  })
  .catch(next)
    ;
  });

  return router;
};
