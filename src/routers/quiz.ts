import { Router } from "express";
import { prisma } from "../client";
import { Prisma, Question, Answer, Tag } from "@prisma/client";
import { validateBody } from "../utils";
import { z } from "zod";

const quizRouter = Router();

quizRouter.post(
  "/",
  validateBody(
    z
      .object({
        count: z.number(),
        tags: z.string().array(),
      })
      .partial()
  ),
  async (req, res) => {
    const body = req.body;
    const number = body.count || 5;
    const tags: string[] = body.tags;

    // const questions = await prisma.$queryRaw(
    //   Prisma.sql`SELECT * from Question INNER JOIN Tag ON Question.id = Tag.questionId WHERE Tag.value IN ("CSS") ORDER BY RANDOM() LIMIT ${number}`
    // );

    const questions = await prisma.question.findMany({
      where: {
        tag: {
          some: {
            value: {
              in: ["HTML", "Javascript", "CSS"],
            },
          },
        },
      },
    });

    // const result: { question: Question; answers: Answer[]; tags: Tag[] }[] = [];
    // for (const question of questions) {
    //   const questionData = {
    //     question: question,
    //     answers: await prisma.answer.findMany({
    //       where: {
    //         questionId: {
    //           equals: question.id,
    //         },
    //       },
    //     }),
    //     tags: await prisma.tag.findMany({
    //       where: {
    //         questionId: {
    //           equals: question.id,
    //         },
    //       },
    //     }),
    //   };
    //   result.push(questionData);
    // }
    res.send(questions);
  }
);

export { quizRouter };
