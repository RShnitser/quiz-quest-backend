import { Router } from "express";
import { prisma } from "../client";
import bcrypt from "bcrypt";
import { createToken, validateBody } from "../utils";
import { z } from "zod";

const authRouter = Router();

authRouter.post(
  "/login",
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    const body = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return res.status(401).send({ message: "Invalid user or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Invalid user or password" });
    }

    const token = createToken(user);

    return res.status(200).send({
      userInfo: {
        email: user.email,
      },
      token: token,
    });
  }
);

export { authRouter };
