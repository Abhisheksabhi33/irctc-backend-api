import express from "express";
const router = express.Router();

import { addNewTrain, updateSeats } from "../controllers/adminController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";


router.post("/train", authenticateUser, isAdmin, addNewTrain);
router.patch("/increaseSeats", authenticateUser, isAdmin, updateSeats);

export default router;

