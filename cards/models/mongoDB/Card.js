const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("../../../helpers/mongoDB/mongooseValidators");
const { Image } = require("../../../helpers/mongoDB/Image");
const currentTime = require("../../../utils/timeService");



const cardSchema = new mongoose.Schema({
    title: DEFAULT_VALIDATION,
    subtitle: {
        ...DEFAULT_VALIDATION,
        required: false,
    },
    images: [Image],
    likesList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    commentsList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    ingredients: [{
        name: {
            type: String,
            required: true,
        },
        quantityInGrams: {
            type: Number,
            required: true,
        },
    }],
    instructionsList: [{
        type: String,
        required: true,
    }],
    description: {
        type: String,
        maxLength: 1024,
        required: false,
    },
    ratings: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        value: {
            type: Number,
            min: 1,
            max: 10,
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: currentTime(),
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

cardSchema.index({ title: 1 });
cardSchema.index({ subtitle: 1 });
cardSchema.index({ 'ingredients.name': 1 });
cardSchema.index({ createdAt: -1 });
cardSchema.index({ user_id: 1 });
cardSchema.index({ ratings: 1 });

cardSchema.virtual('likesCount').get(function () {
    return this.likesList.length;
});

cardSchema.virtual('averageRating').get(function () {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return total / this.ratings.length;
});

cardSchema.set('toJSON', { virtuals: true });
cardSchema.set('toObject', { virtuals: true });

const Card = mongoose.model("Card", cardSchema);

module.exports = { Card };
