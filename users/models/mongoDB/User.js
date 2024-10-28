const mongoose = require("mongoose");
const { EMAIL } = require("../../../helpers/mongoDB/mongooseValidators");
const { Image } = require("../../../helpers/mongoDB/Image");
const { Name } = require("../../../helpers/mongoDB/Name");
const currentTime = require("../../../utils/timeService");

const userSchema = new mongoose.Schema({
    name: Name,
    email: EMAIL,
    password: {
        type: String,
        required: true,
        trim: true,
    },
    profilePicture: Image,
    backgroundPicture: Image,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: currentTime(),
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ 'name.full': 1 });

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model("User", userSchema);

module.exports = { User };
