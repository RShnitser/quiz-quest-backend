import { Router } from "express";
import { authMiddleWare, validateBody } from "../utils";
import { prisma } from "../client";
import { Answer, Question, UserAnswer } from "@prisma/client";
import { z } from "zod";

const historyRouter = Router();

historyRouter.get("/", authMiddleWare, async (req, res) => {
  if (req.user === undefined) {
    return res.status(401).json({ message: "User not found" });
  }

  const history = await prisma.history.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: {
      createdDate: "desc",
    },
  });

  const result: {
    question: Question;
    answers: { userAnswer: UserAnswer; answer: Answer }[];
  }[] = [];

  for (const entry of history) {
    const question = await prisma.question.findUnique({
      where: {
        id: entry.questionId,
      },
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answers = await prisma.answer.findMany({
      where: {
        questionId: question.id,
      },
    });

    const userAnswers = await prisma.userAnswer.findMany({
      where: {
        historyId: entry.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    const answerData = [];
    for (const userAnswer of userAnswers) {
      const foundAnswer = answers.find(
        (answer) => answer.id === userAnswer.answerId
      );
      if (!foundAnswer) {
        return res.status(404).json({ message: "Answer not found" });
      }
      answerData.push({
        userAnswer: userAnswer,
        answer: foundAnswer,
      });
    }

    result.push({
      question: question,
      answers: answerData,
    });
  }

  return res.status(200).send(result);
});

historyRouter.post(
  "/",
  authMiddleWare,
  validateBody(
    z.object({
      questionId: z.number(),
      userAnswers: z
        .object({
          answerId: z.number(),
          answer: z.string().optional(),
          answerApplies: z.boolean().optional(),
          order: z.number().int().positive().optional(),
        })
        .array(),
    })
  ),
  async (req, res) => {
    if (req.user === undefined) {
      return res.status(401).json({ message: "User not found" });
    }

    const body = req.body;

    const newEntry = await prisma.history.create({
      data: {
        userId: req.user.id,
        questionId: body.questionId,
      },
    });

    for (const userAnswer of body.userAnswers) {
      await prisma.userAnswer.create({
        data: {
          historyId: newEntry.id,
          answerId: userAnswer.answerId,
          userAnswer: userAnswer.answer,
          userAnswerApplies: userAnswer.answerApplies,
          order: userAnswer.order,
        },
      });
    }
    return res.status(200).send(newEntry);
  }
);

export { historyRouter };
