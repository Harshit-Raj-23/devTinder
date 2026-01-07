const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware.js");
const User = require("../models/user.model.js");
const ConnectionRequest = require("../models/connectionRequest.model.js");
const requestRouter = express.Router();

requestRouter.get(
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
          .json({ message: "Invalid message type: " + status });
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

module.exports = requestRouter;
