import { Request, Response } from "express";

const Model = require("../models/model");
const express = require("express");

const router = express.Router();

module.exports = router;

//Post Method
router.post("/cards", async (req: Request, res: Response) => {
  const data = new Model({
    front: req.body.front,
    back: req.body.back,
    tags: req.body.tags,
    author: req.body.author,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
