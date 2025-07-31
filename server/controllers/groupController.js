// controllers/messageController.js

const User = require("../models/user");
const Message = require("../models/message");
const cloudinary = require("../lib/cloudinary");
const { getreceiverSocketId, io } = require("../lib/socket");
const group = require("../models/group");
const user = require("../models/user");

exports.postCreateGroupChat = async (req, res) => {
  try {
    console.log("came");
    console.log(req.body);
    const adminId = req.user._id;
    const obj = req.body;
    obj["admin"] = adminId;
    const newGroup = new group(obj);
    await newGroup.save();

    // Add group to all the selected groupuser
    newGroup.groupuser.forEach(async (userId) => {
      await user.findByIdAndUpdate(userId, {
        $addToSet: { groups: newGroup._id },
      });
    });

    return res.status(200).json(newGroup);
  } catch (err) {
    console.error("Error in postCreateGroupChat controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const me = req.user;

    const groupsDetails = await user
      .findById(me)
      .populate("groups")
      .lean()
      .exec();
    console.log("Groups Details:", groupsDetails.groups);
    return res.status(200).json(groupsDetails.groups);
  } catch (err) {
    console.error("Error in get groups controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGroupChatUsers = async (req, res) => {
  try {
    const me = req.user;
    const grpid = req.params.id;
    const groupDetails = await group
      .findById(grpid)
      .populate("groupuser", "-password")
      .lean()
      .exec();

    return res.status(200).json(groupDetails.groupuser);
  } catch (err) {
    console.error("Error in getGroupChatUsers controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGroupChats = async (req, res) => {
  try {
    const grpid = req.params.id;
    const messages = await Message.find({
      receiverId: grpid,
    }).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getGroupChats controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST a new message (text, image, or both)
exports.postGroupChat = async (req, res) => {
  try {
    const recId = req.params.id;
    const senId = req.user._id;
    const { text, image } = req.body;

    console.log("postMessageForGroup › incoming:", {
      recId,
      senId,
      text,
      image,
    });

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
      recModel: "Group",
      text: text || "",
      image: imageUrl,
    });

    await newMsg.save();
    // const recSocketId = getreceiverSocketId(recId);
    // const senSocketId = getreceiverSocketId(senId);
    // // Emit to both receiver and sender (for multi-tab/devices)
    // if (recSocketId) io.to(recSocketId).emit("newMessage", newMsg);
    // if (senSocketId && senSocketId !== recSocketId)
    //   io.to(senSocketId).emit("newMessage", newMsg);
    return res.status(200).json(newMsg);
  } catch (err) {
    console.error("Error in postGroupChat controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const me = req.user;
    const { userId, groupId } = req.body;
    console.log( "removeMember › incoming:", { userId, groupId });
    const groupDetails = await group.findById(groupId);
    console.log( groupDetails);
    if (!groupDetails.admin.equals(me._id)) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    if (!groupDetails.groupuser.includes(userId)) {
      return res.status(404).json({ message: "User not found in group" });
    }
    groupDetails.groupuser = groupDetails.groupuser.filter(
      (uid) => uid.toString() !== userId
    );
    await groupDetails.save();

    return res.status(200).json({ userId });
  } catch (err) {
    console.error("Error in get remove member controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.sucide = async (req, res) => {
  try {
    const me = req.user;
    const { userId, groupId } = req.body;
    console.log( "sucide › incoming:", { userId, groupId });
    const groupDetails = await group.findById(groupId);
    console.log( groupDetails);
    if (!groupDetails.groupuser.includes(userId)) {
      return res.status(404).json({ message: "User not found in group" });
    }
    groupDetails.groupuser = groupDetails.groupuser.filter(
      (uid) => uid.toString() !== userId
    );

    if(!(groupDetails.groupuser?.length > 0)){
      await group.findByIdAndDelete(groupId);
      return res.status(200).json({ userId });
    }

    await groupDetails.save();
    return res.status(200).json({ userId });
  } catch (err) {
    console.error("Error in get sucide member controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};