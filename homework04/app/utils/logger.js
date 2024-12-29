import "dotenv/config"
import colors from "colors/safe.js"

if (!process.env.COLORS_EN) {
    process.env.COLORS_EN = 0
}
const logger = (moduleName) => {
    const log = (message) => {
        if (process.env.COLORS_EN === "1") {
            console.log(`[${colors.blue(moduleName)}]: ${message}; `);
        }else {
            console.log(`[${moduleName}]: ${message}; `);
        }
    };

    const warn = (message) => {
        if (process.env.COLORS_EN === "1")  {
            console.error(`[${colors.red(moduleName)}]: error - ${message}; `);
        } else {
            console.error(`[${moduleName}]: error - ${message}; `);
        }
    };

    return { log, warn };
}

export default logger