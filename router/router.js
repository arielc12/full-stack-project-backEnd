const express = require("express");
const cardsRouterController = require("../cards/routes/cardsRestController");
const usersRouterController = require("../users/routes/usersRestController");
const commentsRouterController = require("../comments/routes/commentsRestController");
const { handleError } = require("../utils/handleErrors");

const router = express.Router();

router.use("/cards", cardsRouterController);
router.use("/users", usersRouterController);
router.use("/comments", commentsRouterController);
router.use((req, res) => {
    handleError(res, 404, "Path not found");
});

module.exports = router;