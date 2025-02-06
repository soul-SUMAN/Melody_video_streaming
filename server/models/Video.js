const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    videoPath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

console.log('Video model schema initialized');

module.exports = mongoose.model('Video', videoSchema);
