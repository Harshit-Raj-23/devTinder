const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware.js");
const User = require("../models/user.model.js");
const ConnectionRequest = require("../models/connectionRequest.model.js");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const isExistingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isExistingConnection) {
        return res
          .status(400)
          .json({ message: "Connection request already exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      if (status === "interested") {
        message = `${req.user.firstName} is ${status} in ${toUser.firstName}`;
      } else {
        message = `${req.user.firstName} ${status} ${toUser.firstName}`;
      }

      res.json({ message, data });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found!" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      const fromUser = await User.findById(connectionRequest.fromUserId);
      res.json({
        message: `${loggedInUser.firstName} ${status} ${fromUser.firstName}'s connection request.`,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

module.exports = requestRouter;
