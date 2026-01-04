const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth.middleware.js");

app.use("/user/login", (req, res) => {
  res.send("User logged in successfully!");
});

app.use("/user/data", userAuth, (req, res) => {
  res.send("User data sent!");
});

app.use("/admin", adminAuth);

app.use("/admin/getAllData", (req, res) => {
  res.send("All data sent!");
});

app.use("/admin/deleteUser", (req, res) => {
  res.send("Deleted a user!");
});

app.listen(7777, () => {
  console.log("Server is serving at port 7777");
});
