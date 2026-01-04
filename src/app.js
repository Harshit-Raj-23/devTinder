const express = require("express");
const User = require("./models/user.model.js");

const app = express();

const connectDB = require("./config/database.js");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Priya",
    lastName: "Saha",
    email: "priya@gmail.com",
    password: "Priya@9",
  });
  try {
    user.save();
    res.send("User saved successfully!!!");
  } catch (error) {
    res.status(400).send("Error saving user : " + error.message);
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
