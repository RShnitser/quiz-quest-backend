import { Router } from "express";
import { prisma } from "../client";
import { Question, Answer, Tag } from "@prisma/client";
import { authMiddleWare, validateBody } from "../utils";
import { z } from "zod";

const quizRouter = Router();

const shuffleArray = <T>(array: Array<T>) => {
  for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
};

quizRouter.post(
  "/",
  authMiddleWare,
  validateBody(
    z.object({
      count: z.number(),
      tags: z.string().array(),
    })
  ),
  async (req, res) => {
    const body = req.body;
    const count = body.count || 5;
    const tags: string[] | undefined = body.tags.length ? body.tags : undefined;

    // const questions = await prisma.$queryRaw(
    //   Prisma.sql`SELECT * from Question INNER JOIN Tag ON Question.id = Tag.questionId WHERE Tag.value IN ("CSS") ORDER BY RANDOM() LIMIT ${number}`
    // );

    const tagIds = await prisma.tag.findMany({
      select: {
        id: true,
      },
      where: {
        value: {
          in: tags,
        },
      },
    });

    const questions = await prisma.question.findMany({
      where: {
        QuestionTag: {
          some: {
            tagId: {
              in: tagIds.map((tag) => tag.id),
            },
          },
        },
      },
    });

    shuffleArray(questions);

    const slicedQuestions = questions.slice(0, count);

    const result: { question: Question; answers: Answer[]; tags: Tag[] }[] = [];
    for (const question of slicedQuestions) {
      const answers = await prisma.answer.findMany({
        where: {
          questionId: {
            equals: question.id,
          },
        },
      });
      shuffleArray(answers);

      const tags = await prisma.tag.findMany({
        where: {
          QuestionTag: {
            some: {
              questionId: {
                equals: question.id,
              },
            },
          },
        },
      });

      const entry = {
        question: question,
        answers: answers,
        tags: tags,
      };

      result.push(entry);
    }

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
    res.status(200).send(result);
  }
);

export { quizRouter };
