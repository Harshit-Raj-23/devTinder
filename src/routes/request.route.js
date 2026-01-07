const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware.js");
const User = require("../models/user.model.js");
const requestRouter = express.Router();

requestRouter.get(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      res.send(
        req.user.firstName +
          " sent connection request to " +
          user.firstName +
          "."
      );
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

module.exports = requestRouter;
