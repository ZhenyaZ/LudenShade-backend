const { Server } = require('socket.io');
var express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routes = require('./src/routes/routes');
const socketHandler = require('./src/sockets/');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.URI],
  },
  transports: ['websocket', 'polling'],
});

require('dotenv').config();
app.use(useragent.express());

app.use(cors({ origin: process.env.URI, credentials: true }));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

app.use('/api',((req, res, next) => {
  const isApple = [req.useragent.isiPhone, req.useragent.isiPad, req.useragent.isiPod, req.useragent.isMac, req.useragent.isSafari].some(Boolean);
  if (isApple){
    res.status(400).send({errorMessage: 'Apple devices are not supported', error: 'AppleError'});
  }else{
    next();
  }}), routes);

socketHandler(io);

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log('MONGO DB CONNECTED');
    server.listen(process.env.PORT, () => {
      console.log(`SERVER RUNNING`);
    });
  })
  .catch((err) => console.log(`ERROR: ${err}`));
