const express = require("express");

const { registerUser, getUser, updateUser, getUsers, login, deleteUser, followUser } = require("../models/usersAccessDataService");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const { validateRegistration, validateLogin, validateEdit } = require("../validations/userValidationService");

const router = express.Router();



router.post("/", async (req, res) => {
    try {
        const error = validateRegistration(req.body);
        if (error) return handleError(res, 400, `Joi Error: ${error}`);
        let user = await registerUser(req.body);
        res.send(user);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const error = validateLogin(req.body);
        if (error) return handleError(res, 400, `Joi Error: ${error}`);
        let { email, password } = req.body;
        let token = await login(email, password);
        res.send(token);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        let users = await getUsers();
        res.send(users);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let user = await getUser(id);
        res.send(user);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const error = validateEdit(req.body);
        if (error) return handleError(res, 400, `Joi Error: ${error}`);
        const userInfo = req.user;
        let { id } = req.params;
        if (userInfo._id !== id && !userInfo.isAdmin) {
            return handleError(res, 403, "you are not autherized to edit this user");
        }
        const newUser = req.body;
        let user = await updateUser(id, newUser);
        res.send(user);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.put("/follow/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const { id } = req.params;
        const result = await followUser(userInfo._id, id);
        res.send(result);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        let { id } = req.params;
        if (userInfo._id !== id && !userInfo.isAdmin) {
            return handleError(res, 403, "You are not authorized to delete this user");
        }
        const result = await deleteUser(id);
        res.send(result);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

module.exports = router;
