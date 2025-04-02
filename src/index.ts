import express, {Request, Response} from 'express';
import {injectCoreServices} from "@root/middlewares/injectCoreServices";
import env from "@root/env";
import {AppDataSource} from "@root/data-source";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import isAuth from "@root/middlewares/isAuth";
import logger from "@root/logger";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "PizzaSpecs",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:4532",
            },
            {
                url: "http://15.235.167.33:9241",
            },
            {
                url: "http://15.235.167.33:7682",
            },
        ],
    },
    apis: ["./src/routes/**/*.js", "./src/routes/**/*.ts"],
};

AppDataSource.initialize()
    .then(() => {
        logger.info("AppDataSource initialized");

        if (env.ENV === "testing") {
            logger.info("Started Application in testing mode.");
            logger.info("Truncating database.");

            const entities = AppDataSource.entityMetadatas;
            const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(", ");
            logger.info(`TRUNCATE ${tableNames} CASCADE;`)
            AppDataSource.query(`TRUNCATE ${tableNames} CASCADE;`)
                .then(() => logger.info("Finished truncating database"));
        }
    })
    .catch((err:any) => {
        console.error(err);
    });

const app = express();

app.use(injectCoreServices);
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.get("/health-check", (req: Request, res: Response) => {
    res.Ok("Work")
})

app.get("/health-check-with-token", isAuth, (req: Request, res: Response) => {
    logger.info("Logged in as", req.currentUser);
    res.Ok("Work")
})

app.get("/health-check-trace-id", (req: Request, res: Response) => {
    return res.InternalServerError({hello: "world"})
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

const specs = swaggerJsdoc(options);
app.get("/manifest", (req, res) => res.Ok(specs));
app.get("/manifest/open-api", (req, res) => {res.json(specs)});
app.use(
  "/specs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.listen(env.APP_PORT, () => {
    logger.info(`Server running on port ${env.APP_PORT}\nURL: http://localhost:${env.APP_PORT}`);
    logger.info(`Current environment:`, env.ENV)
});