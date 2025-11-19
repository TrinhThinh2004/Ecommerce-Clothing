// src/types/express.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: number;
        username: string;
        email: string;
        role: "admin" | "user";
      };
    }
  }
}