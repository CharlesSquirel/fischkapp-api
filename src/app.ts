import "dotenv/config";
import express, { NextFunction } from "express";
import { Express, Request, Response } from "express";
import router from "./routes/routes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import env from "../util/validateEnv";
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const YAML = require("yamljs");
const cors = require("cors");

const corsOptions = {
  origin: env.CORS_ORIGIN,
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type,Authorization",
};

const app: Express = express();

const swaggerDefinition = YAML.load("swagger-config.yaml");
const options = {
  swaggerDefinition,
  apis: ["./routes/routes"],
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors(corsOptions));

app.use(morgan("dev"));

app.use(express.json());

app.use("", router);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "Endpoint not found"));
});
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
