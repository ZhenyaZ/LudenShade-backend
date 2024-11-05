const Chat = require('../../models/Chats');
const User = require('../../models/User');

const deleteChat = async (req, res) => {
  try {
    const chatId = req.query.chat_id.toString();
    const userLogin = req.query.user_login.toString();
    const isGroupChat = req.query.isGroupChat === true;

    if (!chatId || !userLogin) {
      return res
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Origin', process.env.URI)
        .status(404)
        .send({ message: 'Chat ID or User Login not provided' });
    } else {
      const chat = await Chat.findOne({ _id: chatId });
      if (!isGroupChat) {
        if (!chat) {
          return res
            .header('Access-Control-Allow-Credentials', 'true')
            .header('Access-Control-Allow-Origin', process.env.URI)
            .status(404)
            .send({ message: 'Chat not found' });
        }

        const interlocutorLogin = chat.chat_users.find((user) => user.user_login !== userLogin).user_login;
        if (!interlocutorLogin) {
          return res
            .header('Access-Control-Allow-Credentials', 'true')
            .header('Access-Control-Allow-Origin', process.env.URI)
            .status(404)
            .send({ message: 'Interlocutor not found' });
        }
        const interlocutor = await User.findOne({ user_login: interlocutorLogin });
        const user = await User.findOne({ user_login: userLogin });
        if (!user || !interlocutor) {
          return res
            .header('Access-Control-Allow-Credentials', 'true')
            .header('Access-Control-Allow-Origin', process.env.URI)
            .status(404)
            .send({ message: 'User or interlocutor not found' });
        }

        user.user_chats_id = user.user_chats_id.filter((id) => id !== chat.chat_id);
        interlocutor.user_chats_id = interlocutor.user_chats_id.filter((id) => id !== chat.chat_id);

        await User.updateOne({ user_login: userLogin }, { user_chats_id: user.user_chats_id });
        await User.updateOne({ user_login: interlocutorLogin }, { user_chats_id: interlocutor.user_chats_id });
        await User.updateOne(
          { user_login: interlocutorLogin.user_login },
          { user_chats_id: interlocutor.user_chats_id },
        );

        await Chat.deleteOne({ _id: chatId });

        const updatedChats = await Chat.find({ chat_users: { $elemMatch: { user_login: userLogin } } });
        res
          .header('Access-Control-Allow-Credentials', 'true')
          .header('Access-Control-Allow-Origin', process.env.URI)
          .status(200)
          .send({ message: 'Chat deleted', users_chats: updatedChats });
      } else {
        const isAdmin = chat.chat_admin === userLogin;
        if (!isAdmin) {
          return res
            .header('Access-Control-Allow-Credentials', 'true')
            .header('Access-Control-Allow-Origin', process.env.URI)
            .status(403)
            .send({ message: 'Only admin can delete group chat' });
        }
        const user_chat_id = await Chat.findOne({ _id: chatId }).select('chat_id');
        await Chat.deleteOne({ _id: chatId });
        chat.chat_users.forEach(async (user) => {
          await User.updateOne({ user_login: user.user_login }, { $pull: { user_chats_id: user_chat_id.chat_id } });
        });
        res
          .header('Access-Control-Allow-Credentials', 'true')
          .header('Access-Control-Allow-Origin', process.env.URI)
          .status(200)
          .send({ message: 'Group chat deleted' });
      }
    }
  } catch (error) {
    res
      .header('Access-Control-Allow-Credentials', 'true')
      .header('Access-Control-Allow-Origin', process.env.URI)
      .status(500)
      .send({ message: 'Error deleting chat' });
  }
};
module.exports = deleteChat;
