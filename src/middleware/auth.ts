import { NextFunction, RequestHandler } from "express";

export const authorize: RequestHandler = (res, req, next:) => {
  const authHeader = req.headers.authorization;
};
