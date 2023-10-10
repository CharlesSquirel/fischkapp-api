import { InferSchemaType, model } from "mongoose";

const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  front: {
    required: true,
    type: String,
  },
  back: {
    required: true,
    type: String,
  },
  tags: {
    required: true,
    type: [String],
  },
  author: {
    required: true,
    type: String,
  },
}, {timestamps: true});

type Card = InferSchemaType<typeof dataSchema>

export default model<Card>("Card", dataSchema)
