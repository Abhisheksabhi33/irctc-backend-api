import express from "express";

const router = express.Router();

import {bookSeat, getBookingDetails} from "../controllers/bookingController.js"

import { authenticateUser } from "../middlewares/authMiddleware.js";

router.post("/", authenticateUser, bookSeat);
router.get("/details", authenticateUser, getBookingDetails);

export default router;
