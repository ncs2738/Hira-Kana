// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const redis = require('redis');

// Open the port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/HiraKana';


// Setup mongoose's options to use newer functionality
mongoose.set('useCreateIndex', true);
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Set up the redis
let redisURL = {
  hostname: 'redis-16235.c44.us-east-1-2.ec2.cloud.redislabs.com',
  port: '16235',
};

let redisPASS = 'd8rSY0PG3xjcWV88D5rK4DJbS437qqGr';
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}

const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

// Pull in our routes
const router = require('./router.js');

// Prep the app
const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.disable('x-powered-by');
app.use(favicon(`${__dirname}/../hosted/img/ka.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Set the session configurations
app.use(session({
  // Cookie's name
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  // Private key for creating hash seeds
  secret: 'Ganbatte Kudasai',

  // Refreshes the key and keeps it active
  resave: true,

  // Make sessions when not logged in
  saveUninitialized: true,


  cookie:
  {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// Preps CSRF tokens
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token!');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
