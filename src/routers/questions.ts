import { Router } from "express";
import { prisma } from "../client";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  const questions = await prisma.question.findMany();
  res.send(questions);
});

export { questionRouter };
