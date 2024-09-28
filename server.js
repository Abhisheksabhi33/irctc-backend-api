import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trainRoutes from "./routes/trainRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Middleware
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Train Booking API" });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/train", trainRoutes);
app.use("/api/booking", bookingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
