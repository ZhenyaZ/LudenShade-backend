const Chat = require('../../models/Chats');
const User = require('../../models/User');
const generateSymKey = require('../../utils/generateSymKey');
const forge = require('node-forge/lib/forge');

const createChat = async (req, res) => {
  try {
    const { user_login, with_user, room } = req.body;

    const [sender, receiver] = await Promise.all([
      User.findOne({ user_login: user_login }),
      User.findOne({ user_login: with_user }),
    ]);
    const existingChat = await Chat.findOne({ chat_id: room });
    if (!existingChat) {
      const symKey = generateSymKey();

      const senderCryptedSymKey = forge.pki
        .publicKeyFromPem(sender.key.publicKey)
        .encrypt(symKey, 'RSA-OAEP', { md: forge.md.sha256.create() });
      const receiverCryptedSymKey = forge.pki
        .publicKeyFromPem(receiver.key.publicKey)
        .encrypt(symKey, 'RSA-OAEP', { md: forge.md.sha256.create() });

      await Chat.insertMany({
        chat_id: room,
        chat_messages: [],
        chat_users: [
          {
            user_login: user_login,
            user_image: sender.user_image,
            publicKey: sender.key.publicKey,
            symKey: forge.util.encode64(senderCryptedSymKey),
          },
          {
            user_login: with_user,
            user_image: receiver.user_image,
            publicKey: receiver.key.publicKey,
            symKey: forge.util.encode64(receiverCryptedSymKey),
          },
        ],
        isGroupChat: false,
      });

      await User.findOneAndUpdate({ user_login: with_user }, { $addToSet: { user_chats_id: room } });
      await User.findOneAndUpdate({ user_login: user_login }, { $addToSet: { user_chats_id: room } });
      res
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Origin', process.env.URI)
        .status(200)
        .send({ message: 'Chat created', isExist: false });
    } else {
      await Chat.findOneAndUpdate({ chat_id: room }, { $addToSet: { chat_users: { user_login: user_login } } });
      res
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Origin', process.env.URI)
        .status(200)
        .send({ message: 'Chat updated', isExist: true });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = createChat;
