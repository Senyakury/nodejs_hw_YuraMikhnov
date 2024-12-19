// import logger from "../app/utils/logger.js"
import logger from "../app/utils/logger.js";
const { log, warn } = logger("main");

const httpLogger = (req, res, next) => {  
  log(`{[${new Date().toISOString()}] ${req.method} ${req.url}}`);
  next();
};

export default httpLogger;
