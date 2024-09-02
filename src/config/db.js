import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv()

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

export { connectDB };
