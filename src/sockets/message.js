const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/Chats');

const messageSocketHandler = (socket) => {
  try {
    socket.on('message', async (data) => {
      const messageId = uuidv4();
      await Chat.findOneAndUpdate(
        { chat_id: data.room },
        {
          $push: {
            chat_messages: {
              message_id: messageId,
              message: data.message,
              user_login: data.user_login,
              timestamp: Date.now(),
            },
          },
        },
      );
      socket.to(data.room).emit('receive_message', {
        message_id: messageId,
        message: data.message,
        user_login: data.user_login,
        socketId: socket.id,
      });
    });

    socket.on('edit_message', async (data) => {
      const editedAt = new Date().toLocaleString();
      await Chat.findOneAndUpdate(
        { chat_id: data.room, 'chat_messages.message_id': data.message_id },
        {
          $set: {
            'chat_messages.$.message': data.message,
            'chat_messages.$.description': `edited at ${editedAt}`,
          },
        },
      );
    });
    socket.on('delete_message', async (data) => {
      await Chat.findOneAndUpdate(
        {
          chat_id: data.room,
          'chat_messages.message_id': data.message_id,
        },
        {
          $pull: {
            chat_messages: {
              message_id: data.message_id,
            },
          },
        },
      );
    });
  } catch (error) {
    console.error('Socket error:', error);
  }
};

module.exports = messageSocketHandler;
