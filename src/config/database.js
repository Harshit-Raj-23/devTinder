const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://harshitkashyap447_db_user:kTSxOEqJmOAn9RcJ@cluster0.ujvltp2.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;
