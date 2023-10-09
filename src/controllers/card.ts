import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
const Model = require("../models/model");

interface CreateCardBody {
  front?: string;
  back?: string;
  tags?: string[];
  author?: string;
}

export const createCard: RequestHandler<unknown, unknown, CreateCardBody, unknown> = async (req, res, next) => {
  const { front, back, tags, author } = req.body;
  try {
    if (!front || !back || !tags || !author) {
      throw createHttpError(400, "Lack of required datas");
    }
    const newCard = await Model.create({
      front: front,
      back: back,
      tags: tags,
      author: author,
    });
    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
};

export const updateCard: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid card id");
    }
    const updatedData = req.body;
    const options = { new: true };
    const existingData = await Model.findById(id);
    if (!existingData) {
      return res.status(404).json({ message: "Record with the provided ID does not exist." });
    }
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCard: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid card id");
    }
    const data = await Model.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Card not found." });
    }
    const cardCreatedAt = new Date(data.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifferenceMinutes = Math.floor((currentTime - cardCreatedAt) / (1000 * 60));
    if (timeDifferenceMinutes > 5) {
      return res.status(400).json({
        message: "It is not allowed to delete the card after 5 minutes of its creation.",
      });
    }
    await Model.findByIdAndDelete(id);
    res.send(`Document with has been deleted..`);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
