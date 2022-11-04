const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://coolboyalan:RtSX23qZ9j75BEad@cluster0.yzrqd.mongodb.net/url-shortner"
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connectDB };
