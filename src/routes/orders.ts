import express from "express";
import { 
  getOrders, 
  getOrderById, 
  getOrderByPaymentId,
  createOrder, 
  updateOrder, 
  deleteOrder } from "../controllers/orderController";

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  // Replace "*" with specific origin if needed
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // For cookies support
  next();
});

router.get("/", getOrders)
router.get("/:id", getOrderById)
router.get("/payment/:payment_id", getOrderByPaymentId)
router.post("/", createOrder)
router.patch("/:id", updateOrder)
router.delete("/:id", deleteOrder)

export default router