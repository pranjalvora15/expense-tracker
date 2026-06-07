import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { signToken } from "../utils/tokens.js";

const toAuthResponse = (user: {
  _id: unknown;
  name: string;
  email: string;
}) => ({
  user: {
    id: String(user._id),
    name: user.name,
    email: user.email
  },
  token: signToken(String(user._id))
});

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw new HttpError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json(toAuthResponse(user));
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  res.json(toAuthResponse(user));
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select("name email");

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  res.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email
    }
  });
};
