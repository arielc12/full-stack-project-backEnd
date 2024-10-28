const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret_word = process.env.JWT_SECRET;


const generateAuthToken = (user) => {
    const token = jwt.sign({
        _id: user._id,
        isAdmin: user.isAdmin,
    }, secret_word);
    return token;
};

const verifyToken = (token) => {
    try {
        const check = jwt.verify(token, secret_word);
        return check;
    } catch (error) {
        return null;
    }
};

module.exports = { generateAuthToken, verifyToken }