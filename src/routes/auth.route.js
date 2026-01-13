const express = require("express");
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;

    // Encryption of Password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of User Model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();

    // Creating jwt token
    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      message: "SignUp successful!!",
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await user.validatePassword(password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    // Creating jwt token
    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.json({
      message: "Login successful!!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR : " + error.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("User logged out successfully.");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = authRouter;
