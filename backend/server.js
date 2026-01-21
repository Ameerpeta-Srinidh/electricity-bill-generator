const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const billRoutes = require("./routes/bill");

const app = express();

app.use(cors());
app.use(express.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/bill", billRoutes);
app.use("/admin", require("./routes/admin"));

mongoose
  .connect("mongodb://127.0.0.1:27017/Electricity_DB")
  .then(() => console.log("MongoDB Connected"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
