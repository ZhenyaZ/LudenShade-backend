const joinHandler = require('./join');
const messageHandler = require('./message');
const SearchSocketHandler = require('./search');

const socketHandler = (io) => {
  let users = [];

  io.on('connection', (socket) => {
    socket.emit('connected', socket.id);
    socket.on('connected_user', (data) => {
      users = [...users, data];
      io.emit('users', users);
    });

    joinHandler(socket);
    messageHandler(socket);
    SearchSocketHandler(socket);
    socket.on('disconnect', () => {
      users = users.filter((user) => user.socketId !== socket.id);
      io.emit('disconnected_user', users);
    });
  });
};

module.exports = socketHandler;
