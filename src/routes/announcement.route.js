import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const announcementRouter = Router();

announcementRouter.route("/addannouncement").post(
    verifyJWT,
    
)
announcementRouter.route("/deleteannouncement").post(
    verifyJWT,
   
)
announcementRouter.route("/getannouncement").get(
    verifyJWT,
    
)

export {announcementRouter}