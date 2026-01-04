const express = require("express");

const app = express();

app.use("/getAllData", (req, res) => {
  // try {
  // Logic for DB call and get user data
  throw new Error("vseabiae");
  res.send("All data sent!");
  // } catch (error) {
  //   res.status(404).send("Error finding data!");
  // }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("Something went wrong!");
  }
});

app.listen(7777, () => {
  console.log("Server is serving at port 7777");
});
