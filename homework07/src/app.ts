import { CommentsAdminRoutes } from './routes/CommentsAdminRouter';
import { PostsAdminRouter } from './routes/PostsAdminRouter';
import "dotenv/config";
import express from "express";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser"
// import postRouter from "./routes/postRoutes.js";
import { databaseService } from "./services/DatabaseService.js";
import logger from "./app/utils/logger.js";
import { UserAdminRouter } from "./routes/UserAdminRouter";
import path from 'path';
import methodOverride from 'method-override';


const app = express();
const PORT = process.env.PORT
const HOSTNAME = process.env.HOST

const { log , warn } = logger("main")

app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(UserAdminRouter)
app.use(PostsAdminRouter)
app.use(CommentsAdminRoutes)
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
// app.get("/register", (req,res)=>{})
app.get("/register", (req, res) => {
  res.render('register');
});

app.use("/api/v1", userRouter);


app.use((err, req, res, next) => {
  warn(`Error : ${err.message}`);
  res.status(500).json({ error: err.message });
  next()
});


app.listen(PORT,HOSTNAME,() => {
  log(`Server is running on http://${HOSTNAME}:${PORT}`);
});

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

async function handleShutdown(signal) {
  log(`Received ${signal}. Closing PostgreSQL connection...`);
  await databaseService.disconnect();
  log(`${signal} handled. Exiting process.`);
  process.exit(0);
}