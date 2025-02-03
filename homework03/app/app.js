import express from "express"
import httpLogger from "../middleware/httpLogger.js";
import logger from "./utils/logger.js";
const app = express()

const { log, warn } = logger("main");

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
