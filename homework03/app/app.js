import express from "express"
import httpLogger from "../middleware/middleware.js";
import { createWriteStream } from 'fs';
import logger from "./utils/logger.js";
const app = express()

const path = "./logs/server.log"
const writeStream = createWriteStream( path )
const { log, warn } = logger("main");
writeStream.write(log("some info", "stream"));
writeStream.write(warn("some error", "stream"));


app.use(httpLogger)

app.get('/', (req, res , next) => {
    res.send('Hello world');
  });
  app.get('/healthcheck', (req, res , next) => {
    res.send({
      live: true,
      timestamp: new Date().toISOString(),
    });
  });
  app.use((req, res , next) => {
    res.status(404).send("Error 404, Not found")
  });


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
log("some info")
warn("some error")
