const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatsSchema = new Schema({
  chat_id: { type: String, required: false },
  chat_users: { type: Array, required: true },
  chat_messages: { type: Array, required: false },

  chat_name: { type: String, required: false },
  chat_image: { type: String, required: false },
  chat_description: { type: String, required: false },
  chat_admin: { type: String, required: false },
  isGroupChat: { type: Boolean, required: false },
});

module.exports = mongoose.model('chats', ChatsSchema);
