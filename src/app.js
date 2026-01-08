const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route.js");
const profileRouter = require("./routes/profile.route.js");
const requestRouter = require("./routes/request.route.js");
const userRouter = require("./routes/user.route.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
