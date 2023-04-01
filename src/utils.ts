import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { number, z } from "zod";

export const encryptPassword = (password: string) => {
  const saltRounds = 11;
  return bcrypt.hash(password, saltRounds);
};

export const createToken = (user: User) => {
  const userInfo = {
    email: user.email,
  };

  return jwt.sign(userInfo, "secret");
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
    return jwtInfoSchema.parse(jwt.verify(token, "secret"));
  } catch (e) {
    console.error(e);
    return null;
  }
};
