import express, {Request, Response} from "express";
import isOnTesting from "@root/middlewares/isOnTesting";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";

const testOnlyRouter = express.Router();

testOnlyRouter.get('/prune-db', isOnTesting, (req: Request, res: Response)=> {
    const entities = AppDataSource.entityMetadatas;
    const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(", ");
    logger.info(`TRUNCATE ${tableNames} CASCADE;`)
    AppDataSource.query(`TRUNCATE ${tableNames} CASCADE;`)
        .then(() => {
            logger.info("Finished truncating database");

            res.Ok({})
        });
});

module.exports = testOnlyRouter;
