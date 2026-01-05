import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}


export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Bearer <token>
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid authorization header" });
    }

    const token = parts[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Missing JWT_SECRET environment variable");
      return res
        .status(500)
        .json({ message: "Server misconfiguration (missing JWT secret)" });
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
