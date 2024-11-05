const Chat = require('../../models/Chats');
const jsonwebtoken = require('jsonwebtoken');

const getChats = async (req, res) => {
  try {
    const accessToken = jsonwebtoken.verify(req.cookies.accessToken, process.env.JWT_ACCESS_KEY);
    const refreshToken = jsonwebtoken.verify(req.cookies.refreshToken, process.env.JWT_REFRESH_KEY);

    const users_chats = await Chat.find({ chat_users: { $elemMatch: { user_login: accessToken.user_login } } });

    if (res.finished) {
      return;
    } else {
      if (refreshToken.user_login === accessToken.user_login) {
        res
          .header('Access-Control-Allow-Credentials', 'true')
          .header('Access-Control-Allow-Origin', process.env.URI)
          .send({ message: 'success', users_chats: users_chats });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = getChats;
