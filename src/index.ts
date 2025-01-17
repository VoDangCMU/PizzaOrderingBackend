import express from 'express';
import {injectCoreServices} from "@root/middlewares/injectCoreServices";

const app = express();

app.use(injectCoreServices);
app.use(express.json());

app.get("/", (req, res) => {
    res.Ok("Work")
})

app.listen(4532, () => {
    console.log("Server running on port 4532");
});