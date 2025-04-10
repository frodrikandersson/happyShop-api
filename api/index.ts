import app from "../app";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../src/config/db";

connectDB();

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};