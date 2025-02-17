import { exec } from 'child_process';
import path from 'path';
import logger from "@root/logger";

const migrationsPath = path.resolve(__dirname, '..', 'migrations');
const dataSourcePath = path.resolve(
    __dirname,
    '..',
    'data-source.ts',
);

const migrationName = process.argv.slice(2)[0];

function run() {
    if (!migrationName) {
        logger.error('Migration name is missing');
        return;
    }

    logger.info(`Generating migration ${migrationName}`);

    const migrationFilePath = path.resolve(migrationsPath, `${migrationName}`);

    exec(
        `ts-node node_modules/typeorm/cli.js migration:generate -d ${dataSourcePath} ${migrationFilePath}`,
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