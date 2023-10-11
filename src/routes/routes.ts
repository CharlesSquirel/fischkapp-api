import { deleteCard, createCard, updateCard, getCards, getCardsByAuthor, getCardsByTag } from "../controllers/cardcontroller";
import { authorize } from "../middlewares/auth";

const express = require("express");

const router = express.Router();

router.get("/cards", authorize, getCards);

router.get("/cards/author/:author", authorize, getCardsByAuthor)

router.get("/cards/tags/:tag", authorize, getCardsByTag)

router.post("/cards", authorize, createCard);

router.put("/cards/:id", authorize, updateCard);

router.delete("/cards/:id", authorize, deleteCard );

export default module.exports = router;