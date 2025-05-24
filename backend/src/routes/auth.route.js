import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.post("/logout", logout);

//here, we have used put method because we will be upadting/editing something on webpage.
router.put("/update-profile", protectRoute, updateProfile);

//this protectRoute middleware will check whether the user is logged in or not, if it is logged in then only user will be able to update its profile.


router.get("/check", protectRoute, checkAuth);//this route will chcek whether the user is authenticated or not everytime when user refershes or do some action.

export default router;