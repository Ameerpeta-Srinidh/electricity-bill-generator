const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const billRoutes = require("./routes/bill");

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRoutes);
app.use("/bill", billRoutes);
app.use("/admin", require("./routes/admin"));

mongoose
  .connect("mongodb://127.0.0.1:27017/Electricity_DB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Connection Error: ", err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
