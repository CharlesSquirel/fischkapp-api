import { deleteCard, createCard, updateCard } from "../controllers/card";

const express = require("express");

const router = express.Router();

router.post("/cards", createCard);

router.put("/cards/:id", updateCard);

router.delete("/cards/:id", deleteCard );

export default module.exports = router;