// controllers/messageController.js

const User = require("../models/user");
const Message = require("../models/message");
const cloudinary = require("../lib/cloudinary");
const { getreceiverSocketId, io } = require("../lib/socket");

// GET all other users (for sidebar/user list)
exports.getUsers = async (req, res) => {
  try {
    const me = req.user; // set by your auth middleware
    const allUsers = await User.find({ _id: { $ne: me._id } }).select(
      "-password"
    );

    return res.status(200).json(allUsers);
  } catch (err) {
    console.error("Error in getUsers controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChatMessage = async (req, res) => {
  try {
    const recId = req.params.id;
    const senId = req.user._id;
    console.log("getChatMessage › incoming:", { recId, senId });
    const messages = await Message.find({
      $or: [
        { senderId: senId, receiverId: recId },
        { senderId: recId, receiverId: senId },
      ],
    }).sort({ createdAt: 1 });
    console.log("getChatMessage › messages:", messages);
    return res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getChatMessage controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST a new message (text, image, or both)
exports.postMessage = async (req, res) => {
  try {
    const recId = req.params.id;
    const senId = req.user._id;
    const { text, image } = req.body;

    console.log("postMessage › incoming:", { recId, senId, text, image });

    let imageUrl = "";
    if (image) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image);
        imageUrl = uploadRes.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(400).json({ message: "Invalid image data" });
      }
    }

    const newMsg = new Message({
      senderId: senId,
      receiverId: recId,
      text: text || "",
      image: imageUrl,
    });

    await newMsg.save();
    const recSocketId = getreceiverSocketId(recId);
    const senSocketId = getreceiverSocketId(senId);
    // Emit to both receiver and sender (for multi-tab/devices)
    if (recSocketId) io.to(recSocketId).emit("newMessage", newMsg);
    if (senSocketId && senSocketId !== recSocketId)
      io.to(senSocketId).emit("newMessage", newMsg);
    return res.status(200).json(newMsg);
  } catch (err) {
    console.error("Error in postMessage controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
