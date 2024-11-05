const User = require('../models/User');

const SearchUser = async (req, res) => {
  const user_login = req.query.search;
  const user = await User.findOne({ user_login: user_login });
  if (user && user_login !== '') {
    res
      .header('Access-Control-Allow-Credentials', 'true')
      .header('Access-Control-Allow-Origin', process.env.URI)
      .status(200)
      .send({ user });
  } else {
    res
      .header('Access-Control-Allow-Credentials', 'true')
      .header('Access-Control-Allow-Origin', process.env.URI)
      .status(404)
      .send({ message: 'User not found' });
  }
};

module.exports = SearchUser;
