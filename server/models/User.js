const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
});

console.log('User model schema initialized');

module.exports = mongoose.model('User', userSchema);