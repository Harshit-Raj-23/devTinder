const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/test", (req, res) => {
  res.send("This is the test page!");
});

app.use("/hello", (req, res) => {
  res.send("This is the hello page!");
});

app.listen(7777, () => {
  console.log("Server is serving at port 7777");
});
