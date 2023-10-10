import { deleteCard, createCard, updateCard, getCards, getCardsByAuthor, getCardsByTag } from "../controllers/cardcontroller";

const express = require("express");

const router = express.Router();

router.get("/cards", getCards);

router.get("/cards/author/:author", getCardsByAuthor)

router.get("/cards/tags/:tag", getCardsByTag)

router.post("/cards", createCard);

router.put("/cards/:id", updateCard);

router.delete("/cards/:id", deleteCard );

export default module.exports = router;