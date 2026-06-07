import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (userId: string) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
};
