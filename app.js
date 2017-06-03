const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const flash        = require('connect-flash');
require('dotenv').config();


require('./config/passport-config.js');
//mongoose.connect('mongodb://localhost/photostore');
mongoose.connect(process.env.MONGODB_URI);

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Photo Bay';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session({
  secret: 'myphotoapp',
  resave:true,
  saveUninitialized:true,
}));
app.use(flash());

// These need to come AFTER the session middleware
app.use(passport.initialize());
app.use(passport.session());
// ... and BEFORE our routes

// This middleware sets the user variable for all views
// (only if logged in)
//   user: req.user     for all renders!
app.use((req, res, next) => {
  if (req.user) {
    // Creates a variable "user" for views
    res.locals.user = req.user;
  }

  next();
});


//=======ROUTES===========

const index = require('./routes/index');
app.use('/', index);
      //-----photo Route -------
const photos = require('./routes/photoRoute');
app.use('/', photos);
//--------authorization routes
const myAuthRoutes = require('./routes/authRoutes.js');
app.use('/', myAuthRoutes);
//---------user route
const myUserRoutes = require('./routes/userRoute.js');
app.use('/', myUserRoutes); 


// const users = require('./routes/users');
// app.use('/users', users);

const reviews = require('./routes/photoReview');
app.use('/',reviews);











// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
