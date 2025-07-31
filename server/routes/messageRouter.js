const {
  postGroupChat,
  getGroupChats,
  getGroupChatUsers,
  postCreateGroupChat,
  getGroups,
  removeMember,
  sucide,
} = require("../controllers/groupController");
const {
  getUsers,
  getChatMessage,
  postMessage,
  getMedia,
} = require("../controllers/messageController");
const { checkMembership } = require("../middlewares/checkMembership");
const { checkUser } = require("../middlewares/checkUser");

const express = require("express");
const uploadMemory = require("../middlewares/multerUpload");
const messageRouter = express.Router();

// Static routes first
messageRouter.post("/group/create", checkUser, postCreateGroupChat);
messageRouter.get("/group/getgroups", checkUser, getGroups);
messageRouter.get("/user", checkUser, getUsers);
// Only match valid ObjectId for :id
messageRouter.get(
  "/group/getUsers/:id",
  checkUser,
  checkMembership,
  getGroupChatUsers
);
messageRouter.get("/:id", checkUser, getChatMessage);
messageRouter.post(
  "/send/:id",
  uploadMemory.fields([
    { name: "image", maxCount: 1 },
    { name: "voice", maxCount: 1 },
  ]),
  checkUser,
  postMessage
);
messageRouter.get("/media/:id", checkUser, getMedia);

// Group chat routes
messageRouter.get(
  "/group/chats/:id",
  checkUser,
  checkMembership,
  getGroupChats
);
messageRouter.post(
  "/group/send/:id",
  checkUser,
  checkMembership,
  postGroupChat
);

messageRouter.post("/group/remove-a-member/:id", checkUser, removeMember);

messageRouter.post("/group/sucide", checkUser, sucide);

module.exports = messageRouter;
