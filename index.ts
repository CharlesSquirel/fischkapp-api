import { Express, Request, Response } from "express";

const express = require("express");
const app: Express = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
  res.send(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
