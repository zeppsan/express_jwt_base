require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const jwtExtractor = require('./lib/middlewares/jwtExtractor');
const jwtValidator = require('./lib/middlewares/jwtValidator');
var cors = require('cors');
const cookieParser = require('cookie-parser');

var usersRouter = require('./lib/routes/users');
var authRouter = require('./lib/routes/auth');

var app = express();

app.use(cors());
app.use(cookieParser("mysecret"));
app.use(logger('dev'));
app.use(express.json());

app.use('/', jwtExtractor());
app.use('/users',jwtValidator, usersRouter)
app.use('/auth', authRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler


module.exports = app;
