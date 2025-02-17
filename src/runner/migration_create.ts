import { exec } from 'child_process';
import path from 'path';
import logger from "@root/logger";

const migrationsPath = path.resolve(__dirname, '..', 'migrations');

const migrationName = process.argv.slice(2)[0];

function run() {
    if (!migrationName) {
        logger.error('Migration name is missing');
        return;
    }

    logger.info(`Creating migration ${migrationName}`);

    const migrationFilePath = path.resolve(migrationsPath, `${migrationName}`);

    exec(
        `ts-node node_modules/typeorm/cli.js migration:create ${migrationFilePath}`,
        (error, stdout, stderr) => {
            if (error) {
                logger.error(error);
                return;
            }
            logger.info(stdout);
        },
    );
}

run();