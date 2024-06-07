import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createBatch, deleteBatch, getBatch, getUniqueBatchId, updateBatch } from "../controllers/batch.controller.js";

const batchRouter = Router()

batchRouter.route("/createbatch").post(
    verifyJWT,
    createBatch
)
batchRouter.route("/updatebatch").post(
    verifyJWT,
    updateBatch
)
batchRouter.route("/getbatch").get(
    verifyJWT,
    getBatch
)
batchRouter.route("/deletebatch").post(
    verifyJWT,
    deleteBatch
)
batchRouter.route("/getuniquebatchid").get(
    verifyJWT,
    getUniqueBatchId
)
export {batchRouter}