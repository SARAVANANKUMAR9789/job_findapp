import express from "express";

import authRoutes from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import companyRouter from "./companiesRoutes.js";
import jobRoute from "./jobsRoutes.js";

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoutes); //api-v1/auth/
router.use(`${path}users`, userRoute); 
router.use(`${path}companies`, companyRouter); 
router.use(`${path}jobs`, jobRoute);

export default router;