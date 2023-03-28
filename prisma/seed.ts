import { prisma } from "../src/client";

const clearDB = async () => {
  await prisma.userAnswer.deleteMany();
  await prisma.history.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.question.deleteMany();
  await prisma.user.deleteMany();
};

const users = [
  {
    email: "John@gmail.com",
    password: "12345",
  },
  {
    email: "Sally@gmail.com",
    password: "scoobydoo",
  },
];

type Answer = {
  answer: string;
  answerApplies?: boolean;
};

type Question = {
  question: string;
  type: string;
  answers: Answer[];
  tags: string[];
};

type UserAnswer = {
  answerId: number;
  answer?: string;
  answerApplies?: boolean;
  order?: number;
};

type History = {
  userId: number;
  questionId: number;
  date: number;
  answer: UserAnswer[];
};

const user1Q: Question[] = [
  {
    question: "HTML is an acronym for Hypertext _________ Language.",
    type: "Fill in the blank",
    answers: [{ answer: "Markup" }],
    tags: ["HTML"],
  },
  {
    question:
      "Git allows you to work on a new feature without breaking existing code by creating a new __________.",
    type: "Fill in the blank",
    answers: [{ answer: "branch" }],
    tags: ["Git"],
  },
  {
    question: "These are block level elements.",
    type: "All that apply",
    answers: [
      {
        answer: "<p>",
        answerApplies: true,
      },
      {
        answer: "<div>",
        answerApplies: true,
      },
      {
        answer: "<span>",
        answerApplies: false,
      },
      {
        answer: "<nav>",
        answerApplies: true,
      },
    ],
    tags: ["HTML"],
  },
  {
    question: "These methods will always iterate through the entire array.",
    type: "All that apply",
    answers: [
      {
        answer: "map()",
        answerApplies: true,
      },
      {
        answer: "reduce()",
        answerApplies: true,
      },
      {
        answer: "filter()",
        answerApplies: true,
      },
      {
        answer: "find()",
        answerApplies: false,
      },
    ],
    tags: ["Javascript"],
  },
];

const user2Q: Question[] = [
  {
    question:
      "Which hook can be used to run code once when the component is created?",
    type: "Multiple Choice",
    answers: [
      {
        answer: "useEffect",
        answerApplies: true,
      },
      {
        answer: "useState",
        answerApplies: false,
      },
      {
        answer: "useContext",
        answerApplies: false,
      },
      {
        answer: "useMemo",
        answerApplies: false,
      },
    ],
    tags: ["React"],
  },
  {
    question: "Arrays start at index",
    type: "Multiple Choice",
    answers: [
      {
        answer: "0",
        answerApplies: true,
      },
      {
        answer: "1",
        answerApplies: false,
      },
      {
        answer: "2",
        answerApplies: false,
      },
      {
        answer: "3",
        answerApplies: false,
      },
    ],
    tags: ["Javascript"],
  },
  {
    question: "The command git checkout -b feature-nav will",
    type: "Multiple Choice",
    answers: [
      {
        answer: "Create a new branch called feature-nav and switch to it",
        answerApplies: true,
      },
      {
        answer: "Delete the branch called feature-nav",
        answerApplies: false,
      },
      {
        answer: "Create a new branch called feature-nav",
        answerApplies: false,
      },
      {
        answer: "Switch to the existing branch called feature-nav",
        answerApplies: false,
      },
    ],
    tags: ["Git"],
  },
  {
    question: "These are valid units of length in CSS",
    type: "All that apply",
    answers: [
      {
        answer: "vmax",
        answerApplies: true,
      },
      {
        answer: "%",
        answerApplies: true,
      },
      {
        answer: "m",
        answerApplies: false,
      },
      {
        answer: "px",
        answerApplies: true,
      },
    ],
    tags: ["CSS"],
  },
];

const history: History[] = [
  {
    userId: 2,
    questionId: 8,
    answer: [
      {
        answerId: 23,
        answerApplies: false,
        order: 3,
      },
      {
        answerId: 24,
        answerApplies: true,
        order: 1,
      },
      {
        answerId: 25,
        answerApplies: false,
        order: 2,
      },
      {
        answerId: 26,
        answerApplies: true,
        order: 0,
      },
    ],
    date: 1674876567077,
  },
  {
    userId: 2,
    questionId: 2,
    answer: [
      {
        answerId: 2,
        answer: "commit",
      },
    ],
    date: 1674876586877,
  },
  {
    userId: 2,
    questionId: 6,
    answer: [
      {
        answerId: 15,
        answerApplies: true,
        order: 0,
      },
      {
        answerId: 16,
        answerApplies: false,
        order: 1,
      },
      {
        answerId: 17,
        answerApplies: false,
        order: 2,
      },
      {
        answerId: 18,
        answerApplies: false,
        order: 3,
      },
    ],
    date: 1674876589416,
  },
  {
    userId: 2,
    questionId: 5,
    answer: [
      {
        answerId: 11,
        answerApplies: true,
        order: 2,
      },
      {
        answerId: 12,
        answerApplies: false,
        order: 3,
      },
      {
        answerId: 13,
        answerApplies: false,
        order: 0,
      },
      {
        answerId: 14,
        answerApplies: false,
        order: 1,
      },
    ],
    date: 1674876623196,
  },
  {
    userId: 2,
    questionId: 4,
    answer: [
      {
        answerId: 7,
        answerApplies: true,
        order: 2,
      },
      {
        answerId: 8,
        answerApplies: true,
        order: 1,
      },
      {
        answerId: 9,
        answerApplies: true,
        order: 0,
      },
      {
        answerId: 10,
        answerApplies: false,
        order: 3,
      },
    ],
    date: 1674876630772,
  },
  {
    userId: 1,
    questionId: 1,
    answer: [
      {
        answerId: 1,
        answer: "markup",
      },
    ],
    date: 1674876682892,
  },
  {
    userId: 1,
    questionId: 2,
    answer: [
      {
        answerId: 2,
        answer: "branch",
      },
    ],
    date: 1674876688203,
  },
  {
    userId: 1,
    questionId: 4,
    answer: [
      {
        answerId: 7,
        answerApplies: true,
        order: 3,
      },
      {
        answerId: 8,
        answerApplies: true,
        order: 2,
      },
      {
        answerId: 9,
        answerApplies: true,
        order: 1,
      },
      {
        answerId: 10,
        answerApplies: true,
        order: 0,
      },
    ],
    date: 1674876697015,
  },
  {
    userId: 1,
    questionId: 8,
    answer: [
      {
        answerId: 23,
        answerApplies: true,
        order: 0,
      },
      {
        answerId: 24,
        answerApplies: false,
        order: 2,
      },
      {
        answerId: 25,
        answerApplies: true,
        order: 3,
      },
      {
        answerId: 26,
        answerApplies: false,
        order: 4,
      },
    ],
    date: 1674876701987,
  },
  {
    userId: 1,
    questionId: 7,
    answer: [
      {
        answerId: 19,
        answerApplies: true,
        order: 1,
      },
      {
        answerId: 20,
        answerApplies: false,
        order: 2,
      },
      {
        answerId: 21,
        answerApplies: false,
        order: 3,
      },
      {
        answerId: 22,
        answerApplies: false,
        order: 0,
      },
    ],
    date: 1674876759298,
  },
];

const seedUsers = async () => {
  const result = [];
  for (const user of users) {
    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
      },
    });
    result.push(newUser.id);
  }
  return result;
};

const seedDb = async () => {
  const userIds = await seedUsers();
  const questionIds1 = await seedQuestions(user1Q, userIds[0]);
  const questionIds2 = await seedQuestions(user2Q, userIds[1]);
  const answers1 = await seedAnswers(user1Q, questionIds1);
  const answers2 = await seedAnswers(user2Q, questionIds2);

  const questionIds = questionIds1.concat(questionIds2);
  const answerIds = answers1.concat(answers2);

  await seedHistory(userIds, questionIds, answerIds);
};

const seedQuestions = async (array: Question[], id: number) => {
  const result = [];
  for (const question of array) {
    const newQuestion = await prisma.question.create({
      data: {
        question: question.question,
        type: question.type,
        userId: id,
      },
    });
    result.push(newQuestion.id);

    for (const answer of question.answers) {
      const newAnswer = await prisma.answer.create({
        data: {
          questionId: newQuestion.id,
          answer: answer.answer,
          answerApplies: answer.answerApplies,
        },
      });
    }

    for (const tag of question.tags) {
      await prisma.tag.create({
        data: {
          questionId: newQuestion.id,
          value: tag,
        },
      });
    }
  }

  return result;
};

const seedAnswers = async (questions: Question[], questionIds: number[]) => {
  const answerIds = [];
  for (let i = 0; i < questions.length; i++) {
    for (const answer of questions[i].answers) {
      const newAnswer = await prisma.answer.create({
        data: {
          questionId: questionIds[i],
          answer: answer.answer,
          answerApplies: answer.answerApplies,
        },
      });
      answerIds.push(newAnswer.id);
    }
  }
  return answerIds;
};

const seedHistory = async (
  userIds: number[],
  questionIds: number[],
  answerIds: number[]
) => {
  for (const entry of history) {
    const newEntry = await prisma.history.create({
      data: {
        userId: userIds[entry.userId - 1],
        questionId: questionIds[entry.questionId - 1],
        createdDate: new Date(entry.date),
      },
    });
    for (const userAnswer of entry.answer) {
      await prisma.userAnswer.create({
        data: {
          historyId: newEntry.id,
          answerId: answerIds[userAnswer.answerId - 1],
          userAnswer: userAnswer.answer,
          userAnswerApplies: userAnswer.answerApplies,
          order: userAnswer.order,
        },
      });
    }
  }
};

seedDb()
  .then(() => {
    console.log("Database seeded");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
