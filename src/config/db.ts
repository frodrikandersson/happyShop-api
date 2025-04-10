import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// To handle serverless environments
let pool: mysql.Pool | undefined = undefined;

export const connectDB = async () => {
  if (process.env.VERCEL) {
    // In a serverless environment (like Vercel), create a new connection per invocation
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "3306"),
    });

    return connection;
  } else {
    // In a local environment, use a connection pool to reuse connections
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "3306"),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    return pool;
  }
};

// Optional: Add a function to query the pool directly in local development
export const queryDB = async (query: string, params: any[] = []) => {
  const connection = await connectDB();
  
  if (process.env.VERCEL) {
    // In serverless (Vercel), use the single connection directly
    const [rows] = await connection.execute(query, params);
    return rows;
  } else {
    // In local environment, use the pool to query directly
    const [rows] = await connection.query(query, params);
    return rows;
  }
};