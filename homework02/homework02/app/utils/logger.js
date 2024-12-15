import "dotenv/config"
import colors from "colors/safe.js"
if (!process.env.COLORS_EN) {
    process.env.COLORS_EN = 0
}
const logger = (moduleName) => {
    const log = (message) => {
        if (process.env.COLORS_EN === "1") {
            console.log(`[${colors.gray(moduleName)}]: ${colors.blue(message)}`);
        } else {
            console.log(`[${moduleName}]: ${message}`);
        }
    };

    const warn = (message) => {
        if (process.env.COLORS_EN === "1") {
            console.log(`[${colors.gray(moduleName)}]: ${colors.red(message)}`);
        } else {
            console.log(`[${moduleName}]: error - ${message}`);
        }
    };

    return { log, warn };
}
export default logger