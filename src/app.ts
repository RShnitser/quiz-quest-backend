import express from "express";
import { prisma } from "./client";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<div>App</div>");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.listen(3000);
