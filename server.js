require('dotenv').config();

const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');

const sessionOptions = session({
  secret: 'adadad dadsd',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave:false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

app.use(helmet());
app.use(sessionOptions);
app.use(flash());

const { checkCsrfError, csrfMiddleware, middlewareGlobal } = require('./src/middlewares/middleware');

mongoose.connect(process.env.CONNECTIONSTRING)
  .then(()=> {
    app.emit('pronto');
  })
  .catch(e => console.log(e));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'public')))

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

// Nossos middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

app.use(routes);

app.on('pronto', ()=> {  
  app.listen(3000, () => {
    console.log('http://localhost:3000');
    console.log('Servidor executando');
  });
});