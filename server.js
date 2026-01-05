import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import videoRoutes from "./src/routes/videos.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
