import express from 'express';
import {injectCoreServices} from "@root/middlewares/injectCoreServices";
import env from "@root/env";
import {AppDataSource} from "@root/data-source";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import isAuth from "@root/middlewares/isAuth";
import logger from "@root/logger";

AppDataSource.initialize()
    .then(() => logger.debug("AppDataSource initialized"))
    .catch((err:any) => {
        console.error(err);
    });

const app = express();

app.use(injectCoreServices);
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.get("/health-check", (req, res) => {
    res.Ok("Work")
})

app.get("/health-check-with-token", isAuth, (req, res) => {
    res.Ok("Work")
})

const routesPath = path.resolve(__dirname, 'routes');
const routes: Array<string> = fs
    .readdirSync(routesPath)
    .filter((e: string) => !(e.includes('.router.js') || e.includes('.router.ts')));

for (const router of routes) {
    const routerPath = path.resolve(routesPath, router);
    const routerFiles: Array<string> = fs.readdirSync(routerPath).filter((e: string) => e.includes('.router.js') || e.includes('.router.ts'));

    for (const routerFile of routerFiles) {
        const requiredPath = path.resolve(routerPath, routerFile);
        logger.debug("Registering router:", router, "- File: ", requiredPath);

        const routerBody = require(requiredPath);

        app.use(`/${router}`, routerBody)
    }
}

app.listen(env.APP_PORT, () => {
    logger.info(`Server running on port ${env.APP_PORT}\nURL: http://localhost:${env.APP_PORT}`);
});