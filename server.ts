import app from "./app";
import { connectDB } from "./src/config/db";

connectDB();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});