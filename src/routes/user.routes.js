import {Router} from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateUserDetails } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const userRouter = Router()

userRouter.route("/register").post(
  upload.single('avatar'),
    registerUser
);
userRouter.route("/login").post(
  loginUser
)

userRouter.route("/logout").post(
  verifyJWT,
  logoutUser
)

userRouter.route("/updatedetails").post(
  verifyJWT,
  updateUserDetails
)

userRouter.route("/updateavatar").post(
  verifyJWT,
  upload.single('avatar'),
  updateAvatar
)

userRouter.route("/refresh-token").post(refreshAccessToken)


export {userRouter}