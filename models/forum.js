const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      trim: true,
      required: true,
    },
    FCategory:{
        type: String,
        trim: true,
        required: true,
      },
    Description: {
      type: String,
      trim: true,
      required: true,
    },
    Body: {
      type: String,
      trim: true,
      required: true,
    },
    Pic: {
      type: String,
    },
    Created_at: {
        type:Date,
        default: Date.now()
      },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      Comment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comments"
      }

  },
  { timestamps: true }
);

module.exports=mongoose.model("Forum",forumSchema);