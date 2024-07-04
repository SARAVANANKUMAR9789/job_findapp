import express from "express";
import { getApply, getApplycompanydetails, jobApply } from "../controllers/applyController.js";
import { getUser, updateUser } from "../controllers/userController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET user
router.post("/get-user", userAuth, getUser);
router.get("/get-apply/:id", getApply);
router.get("/get-apply-companydetails/:id", getApplycompanydetails);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);
router.put("/job-apply/:id", userAuth, jobApply);

export default router;