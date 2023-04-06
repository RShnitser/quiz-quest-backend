import { Router } from "express";
import { prisma } from "../client";
import { encryptPassword, validateBody } from "../utils";
import { z } from "zod";

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

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: await encryptPassword(body.password),
      },
    });

    res.status(200).send(user);
  }
);

export { userRouter };
