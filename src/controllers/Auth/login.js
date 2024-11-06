const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

async function LoginUser(req, res) {
  try {
    const { user_login, user_password } = req.body;
    const userExist = await User.exists({ user_login: user_login });

    if (userExist !== null) {
      const user = await User.findOne({ user_login: user_login });

      const passwordMatch = await bcrypt.compare(user_password, user.user_password);
      const isUserValid = (user_login === user.user_login && passwordMatch) || user_password === user.user_password;
      if (isUserValid) {
        const jwt_access_token = jsonwebtoken.sign(
          { user_login: user_login, user_password: user_password },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: 900 },
        );
        const jwt_refresh_token = jsonwebtoken.sign(
          { user_login: user_login, user_password: user_password },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: '1d' },
        );

        res
        .header('Access-Control-Allow-Credentials', 'true').cookie('refreshToken', jwt_refresh_token, {
          httpOnly: true,
          secure: true,
          maxAge: 86400000,
          sameSite: 'None',

        });

        res.header('Access-Control-Allow-Credentials', 'true').cookie('accessToken', jwt_access_token, {
          httpOnly: true,
          secure: true,
          maxAge: 15 * 60 * 1000,
          sameSite: 'None',

        });

        res
          .header('Access-Control-Allow-Origin', process.env.URI)
          .status(200)
          .send({
            message: 'Login successful',
            user: {
              user_id: user._id,
              user_name: user.user_name,
              user_login: user.user_login,
              user_password: user.user_password,
              user_email: user.user_email,
              user_image: user.user_image,
              user_description: user.user_description,
              user_chats_id: user.user_chats_id,
              user_pkey: user.key.publicKey,
              user_privateKeyDetail: user.key.privateKeyDetail,
            },
          });
      } else {
        res
          .header('Access-Control-Allow-Credentials', 'true')
          .header('Access-Control-Allow-Origin', process.env.URI)
          .status(500)
          .send({ message: 'Invalid credentials' });
      }
    } else {
      res
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Origin', process.env.URI)
        .status(500)
        .send({ message: 'User does not exist' });
    }
  } catch (err) {
    res
      .header('Access-Control-Allow-Credentials', 'true')
      .header('Access-Control-Allow-Origin', process.env.URI)
      .status(500)
      .send({ message: err });
    console.log(err);
  }
}
module.exports = LoginUser;
