const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String},
    password: { type: String},
    is_Approved: { type: Boolean, default: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
},{
    timestamps: true
});

module.exports = mongoose.model('users', userSchema)