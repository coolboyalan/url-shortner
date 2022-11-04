const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const route = require("./routes/route");
const { connectDB } = require("./config/db");

const app = express();
app.use(bodyparser.json());

connectDB();

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server running on PORT " + (process.env.PORT || 3000));
});
