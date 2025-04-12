import chalk from 'chalk';
import env from "@root/env";

const Logger = {
    error(...args: any[]) {
            console.log(chalk.bgRed.white("ERROR"), ...args);
    },
    info(...args: any[]) {
            console.log(chalk.bgGreen.white("INFO "), ...args);
    },
    debug(...args: any[]) {
        if (env.ENV === "development" || env.ENV === "testing") {
            console.log(chalk.bgMagenta.white("DEBUG"), ...args);
        }
    },
    warn(...args: any[]) {
        if (env.ENV !== "production") {
            console.log(chalk.bgYellow.white("WARN "), ...args);
        }
    }
}

export default Logger;