import "dotenv/config";
import express, { NextFunction } from "express";
import { Express, Request, Response } from "express";
import router from "./routes/routes";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";

const app: Express = express();

app.use(morgan("dev"))

app.use(express.json());

app.use("", router)

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Endpoint not found"));
});
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;