const User = require('../../models/User');

async function RegisterUser(req, res) {
  try {
    const { user_name, user_login, user_email, user_password, publicKey, privateKeyDetail } = req.body;
    const userExist = await User.exists({ user_login: user_login });
    if (user_name && user_login && user_email && user_password && userExist === null) {
      await User.create({
        user_name: user_name,
        user_login: user_login,
        user_email: user_email,
        user_chats_id: [],
        user_password: user_password,
        key: {
          publicKey: publicKey,
          privateKeyDetail: {
            PrivateKey: privateKeyDetail.privateKey,
            salt: privateKeyDetail.salt,
            iv: privateKeyDetail.iv,
          },
        },
      })
        .then((data) => {
          res
            .header('Access-Control-Allow-Origin', process.env.URI)
            .status(200)
            .send({ message: 'Congratulations, your account has been created, you can now login' });
        })
        .catch((err) => {
          res
            .header('Access-Control-Allow-Credentials', 'true')
            .header('Access-Control-Allow-Origin', process.env.URI)
            .status(201)
            .send({ message: err });
          console.log(err);
        });
    } else {
      res
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Origin', process.env.URI)
        .status(500)
        .send({ message: 'User already exist' });
    }
  } catch (err) {
    res
      .header('Access-Control-Allow-Credentials', 'true')
      .header('Access-Control-Allow-Origin', process.env.URI)
      .status(201)
      .send({ message: err });
    console.log(err);
  }
}

module.exports = RegisterUser;
