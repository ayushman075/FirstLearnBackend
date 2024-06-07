import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllMembers, getAllStudents, joinBatch, leaveBatch, notVerified, setVerified } from "../controllers/subscribe.controller.js";

const subscribeRouter = Router();

subscribeRouter.route("/joinbatch").post(
  verifyJWT,
  joinBatch
  );

  subscribeRouter.route("/leavebatch").post(
    verifyJWT,
    leaveBatch
  )

  subscribeRouter.route("/setverifified").post(
    verifyJWT,
    setVerified
  )

  subscribeRouter.route("/notverified").post(
    verifyJWT,
    notVerified
  )

  subscribeRouter.route("/getallmembers").get(
    verifyJWT,
    getAllMembers
  )

  
  subscribeRouter.route("/getallstudents").get(
    verifyJWT,
    getAllStudents
  )

  export {subscribeRouter}