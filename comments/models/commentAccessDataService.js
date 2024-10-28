const { Comment } = require("./mongoDB/Comment");
const { createError } = require("../../utils/handleErrors");
const config = require("config");
const { Card } = require("../../cards/models/mongoDB/Card");
const db = config.get("DB");

const getComments = async () => {
    if (db === "mongodb") {
        try {
            let comments = await Comment.find();
            return comments;
        } catch (error) {
            return createError("Mongoose", 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for these requests"));
};

const getComment = async (commentId) => {
    if (db === "mongodb") {
        try {
            let comment = await Comment.findById(commentId);
            if (!comment) {
                return createError("Mongoose", 404, new Error("Comment not found"));
            }
            return comment;
        } catch (error) {
            return createError("Mongoose", 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for these requests"));
};

const createComment = async (newComment, cardId) => {
    if (db === "mongodb") {
        try {
            let comment = new Comment(newComment);
            comment = await comment.save();
            let card = await Card.findById(cardId);
            if (!card) {
                return createError("Mongoose", 404, new Error("Card not found"));
            }
            card.commentsList.push(comment._id);
            await card.save();
            return comment;
        } catch (error) {
            return createError("Mongoose", 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for these requests"));
};

const editComment = async (commentId, updatedComment) => {
    if (db === "mongodb") {
        try {
            let comment = await Comment.findByIdAndUpdate(
                commentId,
                updatedComment,
                { new: true }
            );
            if (!comment) {
                return createError("Mongoose", 404, new Error("Comment not found or unauthorized"));
            }
            return comment;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for these requests"));
};

const deleteComment = async (commentId, cardId) => {
    if (db === "mongodb") {
        try {
            let comment = await Comment.findByIdAndDelete(commentId);
            if (!comment) {
                return createError("Mongoose", 404, new Error("Comment not found"));
            }
            let card = await Card.findById(cardId);
            if (!card) {
                return createError("Mongoose", 404, new Error("Card not found"));
            }
            card.commentsList.pull(commentId);
            await card.save();
            return comment;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for these requests"));
};

module.exports = { getComments, getComment, createComment, editComment, deleteComment };
