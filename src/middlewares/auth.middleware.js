const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token!");
    }

    const decodedObj = await jwt.verify(token, "Dev@Tinder$23");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exists!");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
};

module.exports = { userAuth };
