import { Router } from "express";
import { prisma } from "../client";
import { Prisma } from "@prisma/client";
import { encryptPassword, validateBody } from "../utils";
import { z } from "zod";
import { createToken } from "../utils";

const userRouter = Router();

userRouter.post(
  "/",
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    const body = req.body;
    console.log("request sent");
    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: await encryptPassword(body.password),
        },
      });

      const token = createToken(user);
      return res.status(200).send({
        userInfo: {
          email: user.email,
        },
        token: token,
      });
    } catch (error) {
      console.error(error);
      let message = "Could not create user";
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          message = `User with email ${body.email} already exists`;
        }
      }
      return res.status(500).send({ message: message });
    }
  }
);

export { userRouter };
