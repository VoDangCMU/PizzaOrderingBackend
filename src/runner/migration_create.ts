import { exec } from 'child_process';
import path from 'path';
const migrationsPath = path.resolve(__dirname, '..', 'migrations');

const migrationName = process.argv.slice(2)[0];

function run() {
    if (!migrationName) {
        console.error('Migration name is missing');
        return;
    }

    console.info(`Creating migration ${migrationName}`);

    const migrationFilePath = path.resolve(migrationsPath, `${migrationName}`);

    exec(
        `ts-node node_modules/typeorm/cli.js migration:create ${migrationFilePath}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                return;
            }
            console.info(stdout);
        },
    );
}

run();