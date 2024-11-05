const User = require('../models/User');
const SearchSocketHandler = async (socket) => {
  try {
    socket.on('search_user', async (data) => {
      const searchQuery = data.searchQuery;
      if (searchQuery === '') {
        socket.emit('search_result', []);
      } else {
        const searched_user = await User.find({ user_login: searchQuery });
        if (searched_user.length > 0) {
          const data = searched_user.map((user) => {
            return {
              user_id: user._id,
              user_name: user.user_name,
              user_login: user.user_login,
              user_image: user.user_image,
            };
          });
          socket.emit('search_result', data);
        } else {
          socket.emit('search_result', []);
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = SearchSocketHandler;
