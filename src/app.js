const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstname: "Harshit", lastName: "Raj" });
});

app.post("/user", (req, res) => {
  console.log(res.body);
  // saving data to DB
  res.send("Data successfully saved to database!!");
});

app.delete("/user", (req, res) => {
  res.send("Deleted successfully!");
});

// This will match all the HTTP methods API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello from the serverr!");
});

app.listen(7777, () => {
  console.log("Server is serving at port 7777");
});
