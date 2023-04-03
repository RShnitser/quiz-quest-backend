import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { number, z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { prisma } from "./client";

export const encryptPassword = (password: string) => {
  const saltRounds = 11;
  return bcrypt.hash(password, saltRounds);
};

export const createToken = (user: User) => {
  const userInfo = {
    email: user.email,
  };

  return jwt.sign(userInfo, process.env.JWT_KEY);
};

const jwtInfoSchema = z.object({
  email: z.string().email(),
  iat: number(),
});

export const getDataFromToken = (token?: string) => {
  if (!token) {
    return null;
  }

  try {
    return jwtInfoSchema.parse(jwt.verify(token, process.env.JWT_KEY));
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const validateBody = (data: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = data.safeParse(req.body);
    if (!result.success) {
      return res.status(401).json(result.error);
    }
    next();
  };
};

export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [, token] = req.headers.authorization?.split(" ") || [];
  const jwtData = getDataFromToken(token);
  if (!jwtData) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  const userFromJwt = await prisma.user.findUnique({
    where: {
      email: jwtData.email,
    },
  });

  if (!userFromJwt) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = userFromJwt;
  next();
};
