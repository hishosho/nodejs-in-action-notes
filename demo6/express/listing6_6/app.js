const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const messages = require('./middleware/messages');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const entries = require('./routes/entries');
const register = require('./routes/register');
const login = require('./routes/login');
const api = require('./routes/api')

const validate = require('./middleware/validate');
const user = require('./middleware/user')

const Entry = require('./models/entry')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(user)
app.use(messages);

//app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api', api.auth)
app.use('/api', api.auth); 
app.get('/api/user/:id', api.user);

app.get('/api/entries/:page?', page(Entry.count), api.entries);

app.get('/', entries.list)
app.get('/post', entries.form)
app.post('/post',
  validate.required('entry[title]'),
  validate.lengthAbove('entry[title]', 4),
  entries.submit)

app.get('/register', register.form)
app.post('/register', { title: 'Register' })

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

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
