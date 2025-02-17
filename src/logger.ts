import chalk from 'chalk';
import env from "@root/env";

const Logger = {
    error(...args: any[]) {
        if (env.ENV !== 'testing')
            console.log(chalk.bgRed.white("ERROR"), ...args);
    },
    info(...args: any[]) {
        if (env.ENV !== 'testing')
            console.log(chalk.bgGreen.white("INFO "), ...args);
    },
    debug(...args: any[]) {
        if (env.ENV === "development") {
            console.log(chalk.bgMagenta.white("DEBUG"), ...args);
        }
    },
    warn(...args: any[]) {
        if (env.ENV !== "production" && env.ENV !== "testing") {
            console.log(chalk.bgYellow.white("WARN "), ...args);
        }
    }
}

export default Logger;