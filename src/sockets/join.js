const Chat = require('../models/Chats');
const User = require('../models/User');
const generateSymKey = require('../utils/generateSymKey');
const forge = require('node-forge/lib/forge');

const joinSocketHandler = (socket) => {
  socket.on('join', async (data) => {
    try {
      const [sender, receiver] = await Promise.all([
        User.findOne({ user_login: data.user_login }),
        User.findOne({ user_login: data.with }),
      ]);

      socket.join(data.room);
      if (data.with) {
        await User.findOneAndUpdate({ user_login: data.with }, { $addToSet: { user_chats_id: data.room } });
        await User.findOneAndUpdate({ user_login: data.user_login }, { $addToSet: { user_chats_id: data.room } });
      } else {
        await Chat.findOneAndUpdate(
          { chat_id: data.room },
          { $addToSet: { chat_users: { user_login: data.user_login } } },
        );
      }
    } catch (error) {
      console.error('Error joining chat:', error);
    }
  });
};

module.exports = joinSocketHandler;
