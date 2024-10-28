const { Card } = require("./mongoDB/Card");
const { createError } = require("../../utils/handleErrors");
const config = require("config");
const db = config.get("DB");

const getCards = async () => {
    if (db === "mongodb") {
        try {
            let cards = await Card.find();
            return cards;
        } catch (error) {
            return createError("Mongoose", 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const getCard = async (cardId) => {
    if (db === "mongodb") {
        try {
            let card = await Card.findById(cardId);
            if (!card) {
                return createError("Mongoose", 404, new Error("Card not found"));
            }
            return card;
        } catch (error) {
            return createError("Mongoose", 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const getMyCards = async (userId) => {
    if (db === "mongodb") {
        try {
            let cards = await Card.find({ user_id: userId });
            return cards;
        } catch (error) {
            return createError("Mongoose", 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const createCard = async (newCard) => {
    if (db === "mongodb") {
        try {
            let card = new Card(newCard);
            card = await card.save();
            return card;
        } catch (error) {
            return createError("Mongoose", 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const updateCard = async (cardId, newCard) => {
    if (db === "mongodb") {
        try {
            let card = await Card.findByIdAndUpdate(
                cardId,
                newCard,
                { new: true }
            );
            if (!card) {
                return createError("Mongoose", 404, new Error("Card not found or unauthorized"));
            }
            return card;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const likeCard = async (userId, cardId) => {
    if (db === "mongodb") {
        try {
            let card = await Card.findById(cardId);
            if (!card) {
                return createError("Mongoose", 404, new Error("Card not found"));
            }
            const index = card.likesList.indexOf(userId);
            if (index === -1) {
                card.likesList.push(userId);
            } else {
                card.likesList.splice(index, 1);
            }
            await card.save();
            return card;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const rateCard = async (userId, cardId, ratingValue) => {
    if (db === "mongodb") {
        try {
            let card = await Card.findById(cardId);
            if (!card) {
                return createError("Mongoose", 404, new Error("Card not found"));
            }
            const existingRatingIndex = card.ratings.findIndex(r => r.userId.toString() === userId);
            if (existingRatingIndex !== -1) {
                card.ratings[existingRatingIndex].value = ratingValue;
            } else {
                card.ratings.push({ userId, value: ratingValue });
            }
            await card.save();
            return card;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this request"));
};


const deleteCard = async (cardId) => {
    if (db === "mongodb") {
        try {
            let card = await Card.findByIdAndDelete(cardId);
            if (!card) {
                return createError("Mongoose", 404, new Error("Card not found or unauthorized"));
            }
            return card;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

module.exports = { getCards, getCard, getMyCards, createCard, updateCard, likeCard, rateCard, deleteCard };
