import express from "express";
import cors from "cors";
import { questionRouter } from "./routers/questions";
import { authRouter } from "./routers/auth";

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_URL: string;
      JWT_KEY: string;
    }
  }
}

for (const key of ["DATABASE_URL", "JWT_KEY"]) {
  if (process.env[key] === undefined) {
    throw new Error(`Missing environment key variable ${key}`);
  }
}
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/questions", questionRouter);

app.listen(3000);
