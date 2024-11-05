const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_name: { type: String, required: true },
  user_login: { type: String, required: true },
  user_email: { type: String, required: true },
  user_password: { type: String, required: true },
  user_image: { type: String, required: false },
  user_description: { type: String, required: false },
  user_chats_id: { type: Array, required: false },
  key: {
    publicKey: { type: String, required: false },
    privateKeyDetail: { type: Object, required: false },
  },
});

module.exports = mongoose.model('user', UserSchema);
