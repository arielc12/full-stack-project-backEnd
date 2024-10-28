const mongoose = require("mongoose");
const currentTime = require("../../../utils/timeService");

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    dateTime: { type: String, default: currentTime() },
}, { timestamps: true });

commentSchema.index({ userId: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };