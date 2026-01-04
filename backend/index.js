const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ ENABLE CORS
app.use(cors());

// ✅ BODY PARSER
app.use(express.json());

// ✅ MONGODB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend + DB connected");
});

// ===============================
// ROUTES
// ===============================

// 🔐 Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

 const profileRoutes = require("./routes/profileRoutes");
 app.use("/api", profileRoutes);

const stressRoutes = require("./routes/stressRoutes");
app.use("/api/stress", stressRoutes);

const sleepFamilyRoutes = require("./routes/sleepFamilyRoutes");
app.use("/api/health", sleepFamilyRoutes);

const analysisRoutes = require("./routes/analysisRoutes");
app.use("/api/health", analysisRoutes);

const doctorSummaryRoutes = require("./routes/doctorSummaryRoutes");
app.use("/api/health", doctorSummaryRoutes);

const doctorSummaryPdfRoutes = require("./routes/doctorSummaryPdfRoutes");
app.use("/api/health", doctorSummaryPdfRoutes);



// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
