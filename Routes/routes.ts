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
