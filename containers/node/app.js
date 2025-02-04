const PORT = 3000;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require("dotenv");
var passport = require('passport');
var session = require('express-session');
//var FacebookStrategy = require('passport-facebook').Strategy;
var  bodyParser        =     require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newsRouter = require('./routes/news');

var app = express();
dotenv.config({ path: "./config/.env" });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter);

app.use(session(
  {
   secret: "secretsession",
   resave: false, 
   saveUninitialized: true,
   cookie: { 
    maxAge: 600000
  }
}));

app.use(passport.initialize());

require('./authenticate');

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  //res.redirect('/');
  res.cookie("username", req.user.displayName.toLowerCase().replaceAll(" ","."));
  res.redirect('/news');
})




require('./authenticate2');

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  //res.redirect('/');
  res.cookie("username", req.user.displayName.toLowerCase().replaceAll(" ","."));
  res.redirect('/news');
})

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

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
});

module.exports = app;