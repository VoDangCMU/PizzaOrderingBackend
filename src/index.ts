import express from 'express';
import {injectCoreServices} from "@root/middlewares/injectCoreServices";
import env from "@root/env";
import {AppDataSource} from "@root/data-source";

AppDataSource.initialize()
    .then(() => console.log('Database connection established'))
    .catch((err) => {
        console.error(err);
    });

const app = express();

app.use(injectCoreServices);
app.use(express.json());

app.get("/", (req, res) => {
    res.Ok("Work")
})

app.listen(env.APP_PORT, () => {
    console.log(`Server running on port ${env.APP_PORT}\nURL: http://localhost:${env.APP_PORT}`);
});