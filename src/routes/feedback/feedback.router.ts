import {Router} from "express";
import createFeedback from "@root/routes/feedback/createFeedback";
import getFeedback from "@root/routes/feedback/getFeedback";
import updateFeedback from "@root/routes/feedback/updateFeedback";
import deleteFeedback from "@root/routes/feedback/deleteFeedback";
import getAllFeedbacks from "@root/routes/feedback/getAllFeedbacks";

const feedback = Router();

feedback.post("/create/", createFeedback);
feedback.get("/get-by-id/:id", getFeedback);
feedback.get("/get-all", getAllFeedbacks)
feedback.put("/update", updateFeedback);
feedback.delete("/elete/:id", deleteFeedback);

module.exports = feedback;