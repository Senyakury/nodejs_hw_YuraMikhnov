import "dotenv/config";
import express from "express";
import userRouter from "../routes/userRoutes.js";
import postRouter from "../routes/postRoutes.js";
import { databaseService } from "../src/DatabaseService.js";
import logger from "./utils/logger.js";
const app = express();


const { log , warn } = logger("main")
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1", userRouter);

app.use("/api/v1", postRouter);

app.use((err, req, res, next) => {
  warn("Error:", err.message);
  res.status(500).json({ error: err.message });
  next()
});

const PORT = process.env.PORT || 3000
app.listen(PORT,() => {
  log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

async function handleShutdown(signal) {
  log(`Received ${signal}. Closing MongoDB connection...`);
  await databaseService.disconnect();
  log(`${signal} handled. Exiting process.`);
  process.exit(0);
}