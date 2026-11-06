const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'products', 
        required: true },
    quantity: { type: Number, required: true, min: 1,max: 5 }
}, {
    timestamps: true
});

module.exports = mongoose.model('orders', orderSchema); 