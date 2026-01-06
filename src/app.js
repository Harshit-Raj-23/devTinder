const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("./models/user.model.js");
const connectDB = require("./config/database.js");
const { validateSignupData } = require("./utils/validation.js");
const { userAuth } = require("./middlewares/auth.middleware.js");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    res.send("User saved successfully!!!");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = user.validatePassword(password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    // Creating jwt token
    const token = await user.getJWT();
    console.log(token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.send("Login successful.");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(req.user.firstName + " sent connection request.");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  console.log(userEmail);

  try {
    const users = await User.find({ email: userEmail });
    res.send(users);
  } catch (error) {
    res.status(404).send("User not found!");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete(userId);
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully!");
  } catch (error) {
    res.status(404).send("User not found!");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10!");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully!");
  } catch (error) {
    res.status(404).send("User not found!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(404).send("No user found!");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established!!!");
    app.listen(7777, () => {
      console.log("Server is serving at port 7777");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!");
  });
