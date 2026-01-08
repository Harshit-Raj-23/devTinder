const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware.js");
const ConnectionRequest = require("../models/connectionRequest.model.js");
const User = require("../models/user.model.js");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully!",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error}` });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({
      message: "Data fetched successfully!",
      data,
    });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error}` });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).populate("fromUserId", "toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId);
      hideUserFromFeed.add(req.toUserId);
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    res.json({
      message: "User feed fetched!",
      data: users,
    });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error}` });
  }
});

module.exports = userRouter;
