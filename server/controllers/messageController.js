// controllers/messageController.js

const User = require("../models/user");
const Message = require("../models/message");
const cloudinary = require("../lib/cloudinary");
const { getreceiverSocketId, io } = require("../lib/socket");
const group = require("../models/group");
const streamifier = require("streamifier");

// GET all other users (for sidebar/user list)
exports.getUsers = async (req, res) => {
  try {
    const me = req.user; // set by auth middleware
    const allUsers = await User.find({ _id: { $ne: me._id } }).select(
      "-password"
    );
    return res.status(200).json(allUsers);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChatMessage = async (req, res) => {
  try {
    const recId = req.params.id;
    const senId = req.user._id;

    const checkgrp = await group.findById(recId);
    let messages = [];
    if (checkgrp) {
      messages = await Message.find({ receiverId: recId }).sort({
        createdAt: 1,
      });
    } else {
      messages = await Message.find({
        $or: [
          { senderId: senId, receiverId: recId },
          { senderId: recId, receiverId: senId },
        ],
      }).sort({ createdAt: 1 });
    }
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const recId = req.params.id;
    const senId = req.user._id;
    const { text } = req.body;

    let imageUrl = "";
    let voiceUrl = "";

    // Handle image upload
    if (req.files && req.files.image && req.files.image[0]) {
      const imageFile = req.files.image[0];
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "chat_images" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(imageFile.buffer).pipe(stream);
        });

      try {
        imageUrl = await uploadFromBuffer();
      } catch (uploadErr) {
        return res.status(400).json({ message: "Invalid image upload" });
      }
    }

    // Handle voice upload
    if (req.files && req.files.voice) {
      const voiceFile = req.files.voice[0];

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "video",
              folder: "chat_voices",
              public_id: voiceFile.originalname.split(".")[0],
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          )
          .end(voiceFile.buffer);
      });

      voiceUrl = result.secure_url;
    }

    // Save message
    const newMsg = new Message({
      senderId: senId,
      receiverId: recId,
      recModel: "User",
      text: text || "",
      image: imageUrl,
      voice: voiceUrl,
    });

    await newMsg.save();

    // Emit via Socket.io
    const currGrp = await group.findById(recId);
    if (currGrp) {
      io.to(currGrp._id.toString()).emit("newgrpMsg", newMsg);
      return res.status(200).json(newMsg);
    }

    const recSocketId = getreceiverSocketId(recId);
    // Don't emit to sender since frontend does optimistic update
    // const senSocketId = getreceiverSocketId(senId);

    if (recSocketId) io.to(recSocketId).emit("newMessage", newMsg);

    // Remove this since we don't want to emit to sender
    // if (senSocketId && senSocketId !== recSocketId)
    //   io.to(senSocketId).emit("newMessage", newMsg);

    return res.status(200).json(newMsg);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMedia = async (req, res) => {
  try {
    const recId = req.params.id;
    const senId = req.user._id;

    const media = await Message.find({
      $or: [
        { senderId: senId, receiverId: recId, image: { $ne: "" } },
        { senderId: recId, receiverId: senId, image: { $ne: "" } },
      ],
    })
      .select("image")
      .sort({ createdAt: 1 });

    return res.status(200).json(media);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
