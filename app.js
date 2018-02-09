"use strict";

/*
 * Main application file
 *
 */

//All Module Requires.
const express = require('express')
  , createNamespace = require('continuation-local-storage').createNamespace
  , requestSharedNameSpace = createNamespace('openST-Platform-NameSpace')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , basicAuth = require('express-basic-auth')
  , helmet = require('helmet')
  , sanitizer = require('express-sanitized')
  , cluster = require('cluster')
  , http = require('http')
  ;

morgan.token('id', function getId (req) {
  return req.id;
});

//All the requires.
const rootPrefix    = "."
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , customMiddleware = require(rootPrefix + '/helpers/custom_middleware')
  , coreConstants   = require( rootPrefix + '/config/core_constants' )
  , responseHelper  = require( rootPrefix + '/lib/formatter/response')
  , brandedTokenRoutes = require( rootPrefix + '/routes/branded_token')
  ;

const assignParams = function (req, res, next) {
  req.decodedParams = req.query;
  next();
};

// if the process is a master.
if (cluster.isMaster) {
  // Set worker process title
  process.title = "OpenST Platform API node master";

  // Fork workers equal to number of CPUs
  const numWorkers = (process.env.OST_CACHING_ENGINE=='none' ? 1 : (process.env.WORKERS || require('os').cpus().length));

  for (var i = 0; i < numWorkers; i++) {
    // Spawn a new worker process.
    cluster.fork();
  }

  // Worker started listening and is ready
  cluster.on('listening', function(worker, address) {
    logger.info(`[worker-${worker.id} ] is listening to ${address.address}:${address.port}`);
  });

  // Worker came online. Will start listening shortly
  cluster.on('online', function(worker) {
    logger.info(`[worker-${worker.id}] is online`);
  });

  //  Called when all workers are disconnected and handles are closed.
  cluster.on('disconnect', function(worker) {
    logger.error(`[worker-${worker.id}] is disconnected`);
  });

  // When any of the workers die the cluster module will emit the 'exit' event.
  cluster.on('exit', function(worker, code, signal) {
    if (worker.exitedAfterDisconnect === true) {
      // don't restart worker as voluntary exit
      logger.info(`[worker-${worker.id}] voluntary exit. signal: ${signal}. code: ${code}`);
    } else {
      // restart worker as died unexpectedly
      logger.error(`[worker-${worker.id}] restarting died. signal: ${signal}. code: ${code}`, worker.id, signal, code);
      cluster.fork();
    }
  });

  // When someone try to kill the master process
  // kill <master process id>
  process.on('SIGTERM', function() {
    for (var id in cluster.workers) {
      cluster.workers[id].exitedAfterDisconnect = true;
    }
    cluster.disconnect(function() {
      logger.info('Master received SIGTERM. Killing/disconnecting it.');
    });
  });

} else if (cluster.isWorker) {
  // if the process is not a master

  // Set worker process title
  process.title = "OpenST Platform API node worker-"+cluster.worker.id;

  // Create express application instance
  const app = express();

  // Load custom middleware and set the worker id
  app.use(customMiddleware({worker_id: cluster.worker.id}));
  app.use(morgan('[:id] :remote-addr - :remote-user [:date[clf]] :method :url :response-time HTTP/:http-version" :status :res[content-length] :referrer :user-agent'));

  // Set request debugging/logging details to shared namespace
  app.use(function(req, res, next) {
    requestSharedNameSpace.run(function() {
      requestSharedNameSpace.set('reqId', req.id);
      requestSharedNameSpace.set('workerId', cluster.worker.id);
      var hrTime = process.hrtime();
      requestSharedNameSpace.set('startTime', hrTime);
      next();
    });
  });

  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  /*
    The below piece of code should always be before routes.
    Docs: https://www.npmjs.com/package/express-sanitized
  */
  app.use(sanitizer());

  app.use('/bt', assignParams, brandedTokenRoutes);
  
  app.use('/', assignParams, function (req, res, next) {
    return responseHelper.successWithData({}).renderResponse(res, 200);
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    return responseHelper.error('404', 'Not Found').renderResponse(res, 404);
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    logger.error(err);
    return responseHelper.error('500', 'Something went wrong').renderResponse(res, 500);
  });

  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port, 443);
  server.on('error', onError);
  server.on('listening', onListening);

}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}
