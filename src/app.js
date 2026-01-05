const express = require("express");
const User = require("./models/user.model.js");

const app = express();

const connectDB = require("./config/database.js");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    user.save();
    res.send("User saved successfully!!!");
  } catch (error) {
    res.status(400).send("Error saving user : " + error.message);
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
