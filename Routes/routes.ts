import { Request, Response } from "express";

const Model = require("../models/model");
const express = require("express");

const router = express.Router();

module.exports = router;

//Post Method
router.post("/cards", async (req: Request, res: Response) => {
  const { front, back, tags, author } = req.body;

  try {
    const existingCard = await Model.findOne({ front });
    if (existingCard) {
      return res.status(400).json({ message: "Card with the same front value already exists." });
    }
    const newCard = new Model({
      front,
      back,
      tags,
      author,
    });
    const savedCard = await newCard.save();

    res.status(200).json(savedCard);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

//Update by ID Method
router.put("/cards/:id", async (req: Request, res: Response) => {
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
});

//Delete by ID Method
router.delete("/cards/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
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
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
