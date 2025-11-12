import express from "express";
import { createVnpayUrl, vnpayIpn, vnpayReturn } from "../controllers/payment.controller";

const router = express.Router();

// POST /api/payment/create
router.post("/create", createVnpayUrl);

// GET /api/payment/vnpay_ipn
router.get("/vnpay_ipn", vnpayIpn);

// GET /api/payment/vnpay_return
router.get("/vnpay_return", vnpayReturn);

export default router;
