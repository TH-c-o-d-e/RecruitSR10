var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var offreRouter = require('./routes/offre');
var candidatureRouter = require('./routes/candidature');
var ficheRouter = require('./routes/fiche');
var organisationRouter = require('./routes/organisation');
var demandeRecruteurRouter = require('./routes/demanderecruteur');
var demandeOrganisationRouter = require('./routes/demandeorganisation');
var session=require('./session');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router.use((req, res, next) => {
  //res.locals.messages = req.flash();
  //next();
//});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organisation', organisationRouter);
app.use('/fiche', ficheRouter);
app.use('/offre', offreRouter);
app.use('/candidature', candidatureRouter);
app.use('/demanderecruteur', demandeRecruteurRouter);
app.use('/demandeorganisation', demandeOrganisationRouter);

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
