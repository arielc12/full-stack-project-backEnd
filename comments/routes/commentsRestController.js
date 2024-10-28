const express = require("express");

const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const validateComment = require("../validation/commentsValidationService");
const { getComments, getComment, createComment, editComment, deleteComment } = require("../models/commentAccessDataService");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const comments = await getComments();
        res.send(comments);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await getComment(id);
        if (!comment) {
            return handleError(res, 404, "Comment not found");
        }
        res.send(comment);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const newComment = {
            body: req.body.body,
            userId: userInfo._id
        };
        const cardId = req.body.cardId;
        const errorMessage = validateComment(newComment);
        if (errorMessage !== "") {
            return handleError(res, 400, "Validation error: " + errorMessage);
        }
        const createdComment = await createComment(newComment, cardId);
        res.status(201).send(createdComment);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const { id } = req.params;
        let updatedComment = {
            ...req.body,
            userId: userInfo._id
        };
        const comment = await getComment(id);
        if (!comment) {
            return handleError(res, 404, "Comment not found");
        }
        if (comment.userId.toString() !== userInfo._id.toString() && !userInfo.isAdmin) {
            return handleError(res, 403, "Only the comment creator or an admin can edit this comment");
        };
        const errorMessage = validateComment(updatedComment);
        if (errorMessage !== "") {
            return handleError(res, 400, "Validation error: " + errorMessage);
        }
        const editedComment = await editComment(id, updatedComment);
        res.send(editedComment);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const { id } = req.params;
        const cardId = req.body.cardId;

        const comment = await getComment(id);
        if (!comment) {
            return handleError(res, 404, "Comment not found");
        }

        if (comment.userId.toString() !== userInfo._id.toString() && !userInfo.isAdmin) {
            return handleError(res, 403, "Only the comment creator or an admin can delete this comment");
        }
        const deletedComment = await deleteComment(id, cardId);
        res.send(deletedComment);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

module.exports = router;
