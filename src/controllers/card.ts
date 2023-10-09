import { RequestHandler } from "express";
const Model = require("../models/model");

export const createCard: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
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

export const updateCard: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
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

export const deleteCard:RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
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
}
