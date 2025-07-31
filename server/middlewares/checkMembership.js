const mongoose = require("mongoose");
const group = require("../models/group");

exports.checkMembership = async (req, res, next) => {
  try {
    const currUser = req.user._id;
    const grpid = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(grpid)) {
      console.log(`checkMembership: "${grpid}" is not an ObjectId → skipping`);
      return next();
    }

    const currGroup = await group.findById(grpid);
    if (!currGroup || !currGroup.groupuser.includes(currUser)) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
