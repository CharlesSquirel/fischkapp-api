import { RequestHandler } from "express";
import env from "../../util/validateEnv";
import createHttpError from "http-errors";

const authorizationStr = env.AUTHORIZATION_STRING

export const authorize: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")){
    throw createHttpError(401, "Unauthorized");
  }
  const token = authHeader.slice(7);
  if (token !== authorizationStr) {
    throw createHttpError(401, "Unauthorized");
  }
  next();
};
