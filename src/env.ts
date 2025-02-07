import {z} from 'zod';
import {config} from 'dotenv';
import * as process from "node:process";

const PORT_PER_ENV = {
    "development": 4532,
    "production": 7682,
    "staging": 9241,
    "testing": 9243,
}

config();

const env_schema = z.object({
    ENV: z
        .union([
            z.literal('development'),
            z.literal('staging'),
            z.literal('production'),
            z.literal('testing'),
        ])
        .optional()
        .default('development'),
    APP_PORT: z.string().regex(/^\d+$/).transform(Number).optional(),
    DB_HOST: z.string().ip(),
    DB_PORT: z.string().regex(/^\d+$/).transform(Number),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
})

const env = env_schema.parse(process.env);

env.APP_PORT = PORT_PER_ENV[env.ENV];

export default env;
