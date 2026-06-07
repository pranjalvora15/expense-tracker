import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"] as const;

if (requiredEnv.some((key) => !process.env[key])) {
  dotenv.config({ path: "server/.env" });
}

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};
