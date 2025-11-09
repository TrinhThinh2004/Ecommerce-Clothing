import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import path from "path";
import { testConnection } from "./config/database";
import productsRouter from "./routes/products";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import categoryRoutes from "./routes/categorys";
import cart from "./routes/cart";
dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
  res.send("Hello backend with CORS + TS + MySQL!");
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/admin', adminRouter);
app.use("/api/v1/categorys", categoryRoutes);
app.use("/api/v1/cart", cart);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test kết nối database khi khởi động server 
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Test kết nối database
  await testConnection();
});
