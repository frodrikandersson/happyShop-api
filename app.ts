import express from "express";
import { connectDB } from "./src/config/db";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import productRouter from "./src/routes/products";
import customerRouter from "./src/routes/customers";
import orderRouter from "./src/routes/orders";
import orderItemRouter from "./src/routes/orderItems";
import stripeRouter from "./src/routes/stripe";
import authRouter from "./src/routes/auth";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://happy-shop-client.vercel.app", "http://localhost:5173"],
  credentials: true,
}));

// Routes
app.use("/products", productRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.use("/order-items", orderItemRouter);
app.use("/stripe", stripeRouter);
app.use("/auth", authRouter);

export default app;