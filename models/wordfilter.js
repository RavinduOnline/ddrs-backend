const mongoose = require("mongoose");

const wordfilterSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      trim: true,
      required: true,
    },
    wcategory: {
        type: String,
        trim: true,
        required: true,
      },
  },
  { timestamps: true }
);

mongoose.model("WordFilter",wordfilterSchema)