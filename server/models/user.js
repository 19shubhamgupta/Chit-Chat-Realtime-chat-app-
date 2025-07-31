const mongoose = require("mongoose");

const userSchemsa = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Not required for Google OAuth users
    },
    profilePicture: {
      type: String,
      default: "/images/defaultProfilePic",
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: [],
      },
    ],
    loginSource: {
      type: String,
      enum: ["chit-chat", "google", 'github'],
      default: "chit-chat",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but ensures uniqueness when present
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchemsa);
