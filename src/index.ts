import express from "express";
import {connectDB} from "./config/db";
import cors from "cors";
import { VercelRequest, VercelResponse } from "@vercel/node";

import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));


app.use(express.json());

// Middleware
import cookieParser from 'cookie-parser';
app.use(cookieParser());


// Routes
import productRouter from "./routes/products";
import customerRouter from "./routes/customers";
import orderRouter from "./routes/orders";
import orderItemRouter from "./routes/orderItems";
import stripeRouter from "./routes/stripe";
import authRouter from "./routes/auth";
app.use('/products', productRouter)
app.use('/customers', customerRouter)
app.use('/orders', orderRouter)
app.use('/order-items', orderItemRouter)
app.use('/stripe', stripeRouter)
app.use('/auth', authRouter)

// Attempt to connect to the database
connectDB()
// Start Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${PORT}`);
})

// export default (req: VercelRequest, res: VercelResponse) => {
//   return app(req, res);
// };