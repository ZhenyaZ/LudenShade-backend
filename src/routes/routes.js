const express = require('express');
// controllers
const LoginUser = require('../controllers/Auth/login');
const Logout = require('../controllers/Auth/logout');
const RegisterUser = require('../controllers/Auth/register');
const getChats = require('../controllers/Chat/GetChats');
const deleteChat = require('../controllers/Chat/DeleteChat');
const changeUserInfo = require('../controllers/UserController');
const SearchUser = require('../controllers/SearchController');
const PrivateKey = require('../controllers/PrivateKeyController');
const tokenValidate = require('../utils/tokenValidate');
const createGroupChat = require('../controllers/Chat/CreateGroupChat');
const createChat = require('../controllers/Chat/CreateChat');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', process.env.URI);
  res.send('hello');
});
routes.post('/register', RegisterUser);
routes.post('/auth', LoginUser);
routes.get('/logout', Logout);

routes.get('/chats', tokenValidate, getChats);
routes.post('/chats', tokenValidate, createChat);
routes.post('/group-chat', tokenValidate, createGroupChat);
routes.delete('/chats', tokenValidate, deleteChat);

routes.get('/search', tokenValidate, SearchUser);
routes.put('/user', tokenValidate, changeUserInfo);
routes.get('/private-key', tokenValidate, PrivateKey);

module.exports = routes;
