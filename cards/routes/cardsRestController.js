const express = require("express");
const { createCard, getCards, getCard, updateCard, deleteCard, likeCard, changeBizNumber, getMyCards, rateCard } = require("../models/cardsAccessDataService");
const auth = require("../../auth/authService");
const normalizeCard = require("../helpers/normalizeCard");
const { handleError } = require("../../utils/handleErrors");
const validateCard = require("../validation/cardValidationService");
const normalizeCardForRegister = require("../helpers/normalizeCardForRegister");


const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        console.log(userInfo._id);
        let card = await normalizeCardForRegister(req.body, userInfo._id);
        const errorMessage = validateCard(card);
        if (errorMessage !== "") {
            return handleError(res, 400, "validation error " + errorMessage);
        }
        card = await createCard(card);
        res.status(201).send(card);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        let cards = await getCards();
        res.send(cards);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.get("/my-cards", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        let cards = await getMyCards(userInfo._id);
        if (!cards) {
            return handleError(res, 404, "No cards found");
        }
        res.send(cards);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let card = await getCard(id);
        if (!card) {
            return handleError(res, 404, "No cards found");
        }
        res.send(card);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        let { id } = req.params;
        let newCard = req.body;
        const fullCardFromDB = await getCard(id);
        if (userInfo._id.toString() !== fullCardFromDB.user_id.toString() && !userInfo.isAdmin) {
            return handleError(res, 403, "only the user who created this card or admin can update this card");
        }
        newCard = await normalizeCard(newCard, userInfo._id, fullCardFromDB);
        const errorMessage = validateCard(newCard);
        if (errorMessage !== "") {
            return handleError(res, 400, "validation error " + errorMessage);
        }
        let card = await updateCard(id, newCard);
        res.send(card);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        let { id } = req.params;
        const fullCardFromDB = await getCard(id);
        if (userInfo._id.toString() !== fullCardFromDB.user_id.toString() && !userInfo.isAdmin) {
            return handleError(res, 403, "only the user who created this card or admin can delete this card");
        }
        let card = await deleteCard(id);
        res.send(card);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.patch("/:cardId", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        let { cardId } = req.params;
        const userId = userInfo._id;
        let card = await likeCard(userId, cardId);
        res.send(card);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.patch("/rate/:cardId", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const { cardId } = req.params;
        const { ratingValue } = req.body;

        if (ratingValue < 1 || ratingValue > 10) {
            return handleError(res, 400, "Rating must be between 1 and 10");
        }

        let card = await rateCard(userInfo._id, cardId, ratingValue);
        res.send(card);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


module.exports = router;
