import "dotenv/config";
import express, { NextFunction } from "express";
import { Express, Request, Response } from "express";
import router from "./routes/routes";
import morgan from "morgan";

const app: Express = express();

app.use(morgan("dev"))

app.use(express.json());

app.use("", router)

app.use((req: Request, res: Response, next: NextFunction) => {
  next(Error("Endpoint not found"));
});
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occured";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  res.status(500).json({ error: errorMessage });
});

export default app;
