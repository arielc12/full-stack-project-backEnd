const { User } = require("./mongoDB/User");
const { generateAuthToken } = require("../../auth/providers/jwt");
const _ = require("lodash");
const { createError } = require("../../utils/handleErrors");
const { comparePasswords, generateUserPassword } = require("../helpers/bcrypt");
const config = require("config");
const db = config.get("DB");



const login = async (email, password) => {
    if (db === "mongodb") {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return createError("Authentication", 401, new Error("Invalid email or password"));
            }

            if (!comparePasswords(password, user.password)) {
                return createError("Authentication", 401, new Error("Invalid email or password"));
            }
            token = generateAuthToken(user);
            return token;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};


const registerUser = async (newUser) => {
    if (db === "mongodb") {
        try {
            let user = new User({
                ...newUser, password: generateUserPassword(newUser.password), followers: [],
                following: []
            });
            user = await user.save();
            return _.pick(user, ["name", "_id", "email"]);
        } catch (error) {
            return createError("Mongoose", 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const getUsers = async () => {
    if (db === "mongodb") {
        try {
            let users = await User.find();
            if (!users) {
                return createError("Mongoose", 404, new Error("User not found"));
            }
            return users;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const getUser = async (userId) => {
    if (db === "mongodb") {
        try {
            let user = await User.findById(userId);
            if (!user) {
                return createError("Mongoose", 404, new Error("User not found"));
            }
            return user;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const updateUser = async (userId, newUser) => {
    if (db === "mongodb") {
        try {
            let user = await User.findByIdAndUpdate(userId, newUser, { new: true });
            if (!user) {
                return createError("Mongoose", 404, new Error("User not found"));
            }
            return user;
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("there is no other db for this requests"));
};

const followUser = async (followerId, followingId) => {
    if (db === "mongodb") {
        try {
            const follower = await User.findById(followerId);
            const following = await User.findById(followingId);

            if (!follower || !following) {
                return createError("Mongoose", 404, new Error("User not found"));
            }
            const isFollowing = follower.following.includes(followingId);
            if (isFollowing) {
                follower.following = follower.following.filter(id => id.toString() !== followingId);
                following.followers = following.followers.filter(id => id.toString() !== followerId);
                await follower.save();
                await following.save();
                return {
                    message: "You have unfollowed succefully"
                };
            } else {
                follower.following.push(followingId);
                following.followers.push(followerId);
                await follower.save();
                await following.save();
                return {
                    message: "You have followed succefully"
                };
            }
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("There is no other DB for this request"));
};


const deleteUser = async (userId) => {
    if (db === "mongodb") {
        try {
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return createError("Mongoose", 404, new Error("User not found"));
            }
            return { message: "User deleted successfully" };
        } catch (error) {
            return createError("Mongoose", error.status || 400, error);
        }
    }
    return createError("DB", 500, new Error("There is no other DB for this request"));
};

module.exports = { login, registerUser, getUsers, updateUser, followUser, getUser, deleteUser };
