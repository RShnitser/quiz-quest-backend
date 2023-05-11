import { Router } from "express";
import { prisma } from "../client";
import { authMiddleWare, validateBody } from "../utils";
import { z } from "zod";

const questionRouter = Router();

questionRouter.post(
  "/",
  authMiddleWare,
  validateBody(
    z.object({
      question: z.string(),
      type: z.string(),
      options: z
        .object({
          answer: z.string(),
          answerApplies: z.boolean().optional(),
        })
        .array(),
      tags: z.string().array(),
    })
  ),
  async (req, res) => {
    const body = req.body;
    const tagIds: number[] = [];

    if (req.user === undefined) {
      return res.status(401).json({ message: "User not found" });
    }

    for (const tag of body.tags) {
      const tagData = await prisma.tag.findUnique({
        where: {
          value: tag,
        },
      });

      if (tagData) {
        tagIds.push(tagData.id);
      } else {
        const newTagData = await prisma.tag.create({
          data: {
            value: tag,
          },
        });

        tagIds.push(newTagData.id);
      }
    }

    const newQuestion = await prisma.question.create({
      data: {
        question: body.question,
        type: body.type,
        userId: req.user.id,
      },
    });

    for (const tagId of tagIds) {
      await prisma.questionTag.create({
        data: {
          tagId: tagId,
          questionId: newQuestion.id,
        },
      });
    }

    for (const option of body.options) {
      await prisma.answer.create({
        data: {
          questionId: newQuestion.id,
          answer: option.answer,
          answerApplies: option.answerApplies,
        },
      });
    }

    return res.status(200).send(newQuestion);
  }
);

export { questionRouter };
