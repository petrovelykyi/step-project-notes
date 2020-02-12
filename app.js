const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const notesRouter = require('./routes/notes');
const apiNotesRouter = require('./routes/api-notes');
const listsRouter = require('./routes/lists');
const apiListsRouter = require('./routes/api-lists');
const usersRouter = require('./routes/users');

const app = express();

app.locals.moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config();

app.use('/', indexRouter);
app.use('/notes', notesRouter);
app.use('/api/notes', apiNotesRouter);
app.use('/lists', listsRouter);
app.use('/api/lists', apiListsRouter);
app.use('/users', usersRouter);

// MongoDB Connection
mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@clustertest-cnqz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  {useNewUrlParser: true, useUnifiedTopology: true},
  () => {
    console.log(`Connected to "${process.env.MONGO_DB}" DB!`)
  });

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error(`Failed to connect to DB "${process.env.MONGO_DB}" on startup `, err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log(`Mongoose default connection to DB ${process.env.MONGO_DB} disconnected`);
});

const gracefulExit = function() {
  mongoose.connection.close(function () {
    console.log(`Mongoose default connection with DB: "${process.env.MONGO_DB}" is disconnected through app termination`);
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
