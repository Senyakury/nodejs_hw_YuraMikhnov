import fs from 'fs';
import "dotenv/config"
import colors from "colors/safe.js"
if (!process.env.COLORS_EN) {
    process.env.COLORS_EN = 0
}
const stream = fs.createWriteStream("./logs/server.log" ,{ flags: 'a' })

const logger = (moduleName) => {
    const log = (message, name) => {
        if(name == "stream"){
            return(`[${moduleName}]: ${message}; `);
        } else if (process.env.COLORS_EN === "1") {
            console.log(`[${colors.blue(moduleName)}]: ${message}; `);
        }else {
            console.log(`[${moduleName}]: ${message}; `);
        }
    };

    const warn = (message, name) => {
        if(name == "stream"){
            return(`[${moduleName}]: ${message}; `);
        } else if (process.env.COLORS_EN === "1" && name !== "stream")  {
            console.error(`[${colors.red(moduleName)}]: ${message}; `);
        } else {
            console.error(`[${moduleName}]: error - ${message}; `);
        }
    };

    return { log, warn };
}
export default logger