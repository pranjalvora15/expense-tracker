import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

type JwtPayload = {
  userId: string;
};

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new HttpError(401, "Authentication token is required");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;

    if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
      throw new HttpError(401, "Invalid authentication token");
    }

    req.user = { id: new mongoose.Types.ObjectId(payload.userId) };
    next();
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
      return;
    }

    next(new HttpError(401, "Invalid or expired authentication token"));
  }
};
