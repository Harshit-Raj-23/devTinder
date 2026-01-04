const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Handling request user 1!");
    next();
    res.send("1st response");
  },
  (req, res, next) => {
    console.log("Handling request user 2!");
    next();
    // res.send("2nd response");
  },
  (req, res, next) => {
    console.log("Handling request user 3!");
    // next();
    // res.send("3rd response");
  }
);

app.listen(7777, () => {
  console.log("Server is serving at port 7777");
});
