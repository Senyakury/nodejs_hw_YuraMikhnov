import "dotenv/config"
import colors from "colors/safe.js"
import { createWriteStream } from 'fs';

const path = "././logs/server.log"
const writeStream = createWriteStream( path )
if (!process.env.COLORS_EN) {
    process.env.COLORS_EN = 0
}
const logger = (moduleName) => {
    const log = (message, name) => {
        if (process.env.COLORS_EN === "1") {
            console.log(`[${colors.blue(moduleName)}]: ${message}; `);
            writeStream.write(`[${moduleName}]: ${message}; `)
        }else {
            console.log(`[${moduleName}]: ${message}; `);
            writeStream.write(`[${moduleName}]: ${message}; `)
        }
    };

    const warn = (message, name) => {
        if (process.env.COLORS_EN === "1" && name !== "stream")  {
            console.error(`[${colors.red(moduleName)}]: error - ${message}; `);
            writeStream.write(`[${moduleName}]: ${message}; `)
        } else {
            console.error(`[${moduleName}]: error - ${message}; `);
            writeStream.write(`[${moduleName}]: ${message}; `)
        }
    };

    return { log, warn };
}

export default logger