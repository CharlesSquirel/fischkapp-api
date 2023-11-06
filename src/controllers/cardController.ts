import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import CardModel from "../models/model";

interface ICardBody {
  front?: string;
  back?: string;
  tags?: string[];
  author?: string;
}

interface AuthorParams {
  author: string;
}

interface TagsParams {
  tag: string;
}

interface UptadeCardParams {
  id: string;
}

export const getCards: RequestHandler = async (req, res, next) => {
  try {
    const cards = await CardModel.find().sort({ createdAt: "desc" }).exec();
    if (!cards) {
      throw createHttpError(404, "Cards not found");
    }
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
};

export const getCardsByAuthor: RequestHandler<AuthorParams, unknown, ICardBody, unknown> = async (req, res, next) => {
  const queryAuthor = req.params.author;
  try {
    const cards = await CardModel.find({ author: queryAuthor }).sort({ createdAt: "desc" }).exec();
    if (!cards || cards.length === 0) {
      throw createHttpError(404, "Cards not found");
    }
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
};

export const getCardsByTag: RequestHandler<TagsParams, unknown, ICardBody, unknown> = async (req, res, next) => {
  const queryTag = req.params.tag;
  try {
    const cards = await CardModel.find({ tags: queryTag }).sort({ createdAt: "desc" }).exec();
    if (!cards || cards.length === 0) {
      throw createHttpError(404, "Cards not found");
    }
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
};

export const createCard: RequestHandler<unknown, unknown, ICardBody, unknown> = async (req, res, next) => {
  const { front, back, tags, author } = req.body;
  try {
    if (!front || !back || !tags || !author) {
      throw createHttpError(400, "Lack of required datas");
    }
    const existingCard = await CardModel.findOne({ front });
    if (existingCard) {
      throw createHttpError(400, "Card with the same 'front' already exists");
    }
    const newCard = await CardModel.create({
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

export const updateCard: RequestHandler<UptadeCardParams, unknown, ICardBody, unknown> = async (req, res, next) => {
  const id = req.params.id;
  const newFront = req.body.front;
  const newBack = req.body.back;
  const newTags = req.body.tags;
  const newAuthor = req.body.author;

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid card id");
    }
    if (!newFront || !newBack || !newTags || !newAuthor) {
      throw createHttpError(400, "Lack of required datas");
    }
    const card = await CardModel.findById(id).exec();
    if (!card) {
      throw createHttpError(404, "Card not found");
    }
    card.front = newFront;
    card.back = newBack;
    card.tags = newTags;
    card.author = newAuthor;
    const uptadeCard = await card.save();
    res.status(200).json(uptadeCard);
  } catch (error) {
    next(error);
  }
};

export const deleteCard: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid card id");
    }
    const card = await CardModel.findById(id);
    if (!card) {
      throw createHttpError(404, "Card not found");
    }
    const cardCreatedAt = new Date(card.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifferenceMinutes = Math.floor((currentTime - cardCreatedAt) / (1000 * 60));
    if (timeDifferenceMinutes > 5) {
      throw createHttpError(403, "It is not allowed to delete the card after 5 minutes of its creation.");
    }
    await card.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
