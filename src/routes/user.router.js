import { Router } from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentUser,
    refreshAccessToken,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
// Authorised Routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
