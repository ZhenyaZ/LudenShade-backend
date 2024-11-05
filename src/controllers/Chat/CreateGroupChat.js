const Chat = require('../../models/Chats');
const User = require('../../models/User');
const { v4: uuidv4 } = require('uuid');
const forge = require('node-forge/lib/forge');
const generateSymKey = require('../../utils/generateSymKey');

const createGroupChat = async (req, res) => {
  const groupName = req.body.data.groupName;
  const groupMembers = req.body.data.groupMembers;
  const groupAdmin = req.body.data.groupAdmin;
  const groupDescription = req.body.data.groupDescription;
  const groupImage = req.body.data.groupImage;

  let members = [];

  try {
    const chat_id = uuidv4();
    const symKey = generateSymKey();

    for (let i = 0; i < groupMembers.length; i++) {
      const user = await User.findOne({ user_login: groupMembers[i] });
      const cryptedSymKey = forge.pki
        .publicKeyFromPem(user.key.publicKey)
        .encrypt(symKey, 'RSA-OAEP', { md: forge.md.sha256.create() });
      members.push({
        user_login: user.user_login,
        publicKey: user.key.publicKey,
        symKey: forge.util.encode64(cryptedSymKey),
      });
    }
    await User.updateMany({ user_login: { $in: groupMembers } }, { $addToSet: { user_chats_id: chat_id } });
    await Chat.insertMany({
      chat_id: chat_id,
      chat_name: groupName,
      chat_users: members,
      chat_admin: groupAdmin,
      chat_description: groupDescription,
      chat_image: groupImage,
      isGroupChat: true,
    });
    res
      .header('Access-Control-Allow-Credentials', 'true')
      .header('Access-Control-Allow-Origin', process.env.URI)
      .status(200)
      .send({ message: 'Group chat created' });
  } catch (error) {
    res
      .header('Access-Control-Allow-Credentials', 'true')
      .header('Access-Control-Allow-Origin', process.env.URI)
      .status(500)
      .send({ message: error });
    console.log(error);
  }
};

module.exports = createGroupChat;
