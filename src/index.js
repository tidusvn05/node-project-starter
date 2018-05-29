// for run with babel-node
if (!global._babelPolyfill) {
  require('babel-polyfill');
}

// for build
// import 'babel-polyfill';


import mongoose from 'mongoose';
import util from 'util';
// import process.env from './process.env/env';
import dotenv from 'dotenv';
import app from './config/express';

dotenv.config();

const debug = require('debug')('node-starter:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
mongoose.connect(process.env.db, { keepAlive: 60 });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${process.env.db}`);
});

// print mongoose logs in dev env
if (process.env.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port process.env.port
  app.listen(process.env.port, () => {
    debug(`server started on port ${process.env.port} (${process.env.env})`);
  });
}

export default app;
