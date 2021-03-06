import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
// import expressJwt from 'express-jwt';
import helmet from 'helmet';
import winstonInstance from './winston';
import routes from '../routes/index.route';
import APIError from '../helpers/APIError';
// For web config
import path from 'path';

const app = express();

if (process.env.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());


// setup views
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (process.env.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: false, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// app.use('/api', expressJwt({ secret: process.env.jwtSecret }));
// app.use('/api', (req, res, next) => {
//   const authorization = req.header('authorization');
//   res.locals.session = JSON.parse(new Buffer((authorization.split(' ')[1]).split('.')[1], 'base64').toString()); // eslint-disable-line no-param-reassign
//   next();
// });

// Validate hook
app.use('/hook', (req, res, next) => {
  console.log('hokkkkk');
  console.log(req.body.token);
  if (process.env.hookSecretKey === req.body.token) {
    next();
  }
});

// mount all routes on / path
app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    return res.status(err.status).json({
      error: unifiedErrorMessage,
      stack: process.env.env === 'development' ? err.stack : {}
    });
  } else if (!(err instanceof APIError)) {
    return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message,
      stack: process.env.env === 'development' ? err.stack : {}
    });
  }
  return next(err);
});

// catch 404 and forward to error handler
// app.use((req, res, next) => res.status(httpStatus.NOT_FOUND).json({ error: 'API not found' })); // eslint-disable-line no-unused-vars

// log error in winston transports except when executing test suite
if (process.env.env !== 'test') {
  /* app.use(expressWinston.errorLogger({
    winstonInstance
  }));*/
}

// error handler, send stacktrace only during development
// app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
//   res.status(err.status).json({
//     error: err.isPublic ? err.message : httpStatus[err.status],
//     stack: process.env.env === 'development' ? err.stack : {}
//   })
// );

export default app;
