import express from "express"
import mongoose from "mongoose"
import route from "./routes/route.js";
import { connectDB } from "./config/db.js"

const app = express();
app.use(express.json());

connectDB();

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server running on PORT " + (process.env.PORT || 3000));
});
