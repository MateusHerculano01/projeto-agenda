const express = require('express');
const route = express.Router();

const HomeController = require('./src/controllers/HomeController');
const LoginController = require('./src/controllers/LoginController');
const ContatoController = require('./src/controllers/ContatoController');

const { loginRequired } = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', HomeController.index);

// Rotas de login
route.get('/login/index', LoginController.index);
route.post('/login/register', LoginController.register);
route.post('/login/login', LoginController.login);
route.get('/login/logout', LoginController.logout);

// Rotas de contato
route.get('/contato/index', loginRequired, ContatoController.index);
route.post('/contato/register', loginRequired, ContatoController.register);
route.get('/contato/index/:id', loginRequired, ContatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, ContatoController.edit);


module.exports = route;