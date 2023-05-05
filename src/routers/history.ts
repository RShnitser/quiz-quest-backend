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
    id: number;
    //userId: number;
    question: Question;
    answers: { userAnswer: UserAnswer; answer: Answer }[];
    date: Date;
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
      id: entry.id,
      //userId: req.user.id,
      question: question,
      answers: answerData,
      date: entry.createdDate,
    });
  }

  return res.status(200).send(result);
});

historyRouter.post(
  "/",
  authMiddleWare,
  validateBody(
    z
      .object({
        questionId: z.number(),
        userAnswer: z.array(
          z.object({
            answerId: z.number(),
            userAnswer: z.string().optional(),
            userAnswerApplies: z.boolean().optional(),
            order: z.number().int().optional(),
          })
        ),
      })
      .array()
  ),
  async (req, res) => {
    if (req.user === undefined) {
      return res.status(401).json({ message: "User not found" });
    }

    const body = req.body;

    for (const entry of body) {
      const newEntry = await prisma.history.create({
        data: {
          userId: req.user.id,
          questionId: entry.questionId,
        },
      });

      for (const userAnswer of entry.userAnswer) {
        await prisma.userAnswer.create({
          data: {
            historyId: newEntry.id,
            answerId: userAnswer.answerId,
            userAnswer: userAnswer.userAnswer,
            userAnswerApplies: userAnswer.userAnswerApplies,
            order: userAnswer.order,
          },
        });
      }
    }
    return res.status(200).json({ message: "Success" });
  }
);

export { historyRouter };
