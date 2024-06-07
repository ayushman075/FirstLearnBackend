import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const assignmentRouter = Router();

assignmentRouter.route("/addassignment").post(
    verifyJWT,
    
)
assignmentRouter.route("/deleteassignment").post(
    verifyJWT,
   
)
assignmentRouter.route("/getassignment").get(
    verifyJWT,
    
)

export {assignmentRouter}