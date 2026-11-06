const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order_model');
const Product = require('../models/product_model');

//POST /api/v1/:id/orders
router.post('/products/:id/orders', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        // Validate the product ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid product ID',
                data: null
            });
        }

        // Check if the product exists
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
            return res.status(400).json({
                status: 400,
                message: 'Quantity must be an integer between 1 and 5',
                data: null
            });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(400).json({
                status: 400,
                message: 'Product not found or insufficient stock',
                data: null
            });
        }

        let newOrder;

        try {
            
            newOrder = new Order({
                productId: id,
                quantity: quantity
            });
            await newOrder.save()
        } catch (error) {
            await Product.updateOne(
                {_id: id},
                { $inc: { stock: quantity}}
            );

            throw saveError;
        }

        return res.status(201).json({
            status: 201,
            message: 'Order created successfully',
            data: {
                order: newOrder,
                remainingStock: updatedProduct.stock
            }
        });
    } catch (error){
        console.error('Error creating order:', error);

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
});


// GET /api/v1/orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();

        return res.status(200).json({
            status: 200,
            message: 'Orders retrieved successfully',
            data: orders
        });

    } catch (error) {
        console.error('Error retrieving orders:', error);

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
});


// GET /api/v1/products/:id/orders
router.get('/products/:id/orders', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid product ID',
                data: null
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(400).json({
                status: 400,
                message: 'Product not found',
                data: null
            });
        }

        const orders = await Order.find({
            productId: id
        });

        return res.status(200).json({
            status: 200,
            message: 'Product orders retrieved successfully',
            data: orders
        });

    } catch (error) {
        console.error('Error retrieving product orders:', error);

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
});


module.exports = router;