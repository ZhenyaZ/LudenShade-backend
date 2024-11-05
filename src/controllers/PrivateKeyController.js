const User = require('../models/User');

module.exports = async (req, res) => {
  const user_login = req.query.user_login;
  const intercolutor_user_login = req.query.intercolutor_user_login;
  const intertcolutorPrivateKey = await User.findOne({ user_login: intercolutor_user_login }).select(
    'key.privateKeyDetail',
  );
  const senderPrivateKey = await User.findOne({ user_login: user_login }).select('key.privateKeyDetail');
  const intercolutor_user_password = await User.findOne({ user_login: intercolutor_user_login }).select(
    'user_password',
  );
  res
    .header('Access-Control-Allow-Credentials', 'true')
    .header('Access-Control-Allow-Origin', process.env.URI)
    .status(200)
    .send({
      senderPrivateKey: senderPrivateKey.key.privateKeyDetail,
      intercolutorPrivateKey: intertcolutorPrivateKey.key.privateKeyDetail,
      intercolutor_password: intercolutor_user_password.user_password,
    });
};
