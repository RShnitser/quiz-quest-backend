import express from "express";
import cors from "cors";
import { questionRouter } from "./routers/questions";
import { authRouter } from "./routers/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/questions", questionRouter);

app.listen(3000);
