const Chat = require('../models/Chats');
const User = require('../models/User');

const changeUserInfo = async (req, res) => {
  const { user_id, user_name, user_login, user_image, user_description } = req.body.data;
  try {
    if (req.body.data.user_id) {
      const user = await User.findOne({ _id: user_id });
      if (user) {
        await User.updateOne(
          { _id: user_id },
          { user_name: user_name, user_login: user_login, user_image: user_image, user_description: user_description },
        );
        const userChat = await Chat.findOne({ chat_users: { $elemMatch: { user_login: user.user_login } } });
        if (userChat) {
          await Chat.updateOne(
            { chat_id: userChat.chat_id },
            { $set: { 'chat_users.$[elem].user_login': user_login, 'chat_users.$[elem].user_image': user_image } },
            { arrayFilters: [{ 'elem.user_login': user.user_login }] },
          );
        }
        res
          .header('Access-Control-Allow-Credentials', 'true')
          .header('Access-Control-Allow-Origin', process.env.URI)
          .status(200)
          .send({ message: 'User info updated' });
      } else {
        res
          .header('Access-Control-Allow-Credentials', 'true')
          .header('Access-Control-Allow-Origin', process.env.URI)
          .status(404)
          .send({ message: 'User not found' });
      }
    } else {
      res
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Origin', process.env.URI)
        .status(404)
        .send({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = changeUserInfo;
