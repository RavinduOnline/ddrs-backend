const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  forum_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Forum",
  },
  reply: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  name:{
    type:String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
  },
});



module.exports = mongoose.model("Reply", replySchema);
