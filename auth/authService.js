const { createError, handleError } = require("../utils/handleErrors");
const { verifyToken } = require("./providers/jwt");
const config = require("config");
const tokenGenerator = config.get("TOKEN_GENERATOR");
const auth = (req, res, next) => {
    if (tokenGenerator === "jwt") {
        try {
            const tokenFromClient = req.header("x-auth-token");
            if (!tokenFromClient) {
                return createError("Authentication", 400, new Error("Please Login"));
            }
            const userInfo = verifyToken(tokenFromClient);
            if (!userInfo) {
                return createError("Authentication", 401, new Error("Unauthorize user"));
            }
            req.user = userInfo;
            return next();
        } catch (error) {
            return handleError(res, 401, error.message);
        }
    }
    return handleError(res, 500, "you did not used valid token generator");
};
module.exports = auth;