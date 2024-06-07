import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const materialRouter = Router();

materialRouter.route("/addmaterial").post(
    verifyJWT,
    
)
materialRouter.route("/deletematerial").post(
    verifyJWT,
   
)
materialRouter.route("/getmaterial").get(
    verifyJWT,
    
)

export {materialRouter}