import express from "express";
const router = express.Router();
import { getSeatAvailability } from "../controllers/trainController.js";

router.get("/availability", getSeatAvailability);

export default router;
