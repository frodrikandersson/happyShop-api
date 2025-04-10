import express from "express";
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
app.use("/api/products", productRouter);
app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/order-items", orderItemRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/auth", authRouter);

export default app;