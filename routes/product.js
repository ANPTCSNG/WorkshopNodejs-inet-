const exress = require('express');
const router = exress.Router();
const Product = require('../models/product_model');
const mongoose = require('mongoose');

// [POST] /api/v1/products

router.post('/', async (req, res) => {
    const {name, stock} = req.body;

    try{
        if(!name || !Number.isInteger(stock) || stock < 0){
            return res.status(400).json({ message: 'Invalid product data' });
        }

        const newProducts = new Product({ name, stock });

        await newProducts.save();

        return res.status(201).json({ message: 'Product created successfully', data: newProducts });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({status: 500, message: 'Internal server error' ,data: null});
    }

});

//Get apoi/v1/products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ status: 200, message: 'Products retrieved successfully', data: products });
    } catch (error) {
        console.error('Error retrieving products:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error', data: null });
    }   
});



router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(400).json({
                status: 400,
                message: 'Product not found',
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Product retrieved successfully',
            data: product
        });

    } catch (error) {
        console.error('Error retrieving product:', error);

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
});


//PUT /api/v1/products/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, stock } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid product ID',
                data: null
            });
        }
        if (!name || !Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid product data',
                data: null
            });
        }

        const product = await Product.findByIdAndUpdate(id, { name, stock }, { new: true });

        if (!product) {
            return res.status(400).json({
                status: 400,
                message: 'Product not found',
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Product updated successfully',
            data: product
        });
} catch (error) {
    console.error('Error updating product:', error);

    return res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null
    });
}

});
        
//DELETE /api/v1/products/:id

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid product ID',
                data: null
            });
        }
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(400).json({
                status: 400,
                message: 'Product not found',
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Product deleted successfully',
            data: null
        });
    } catch (error) {
        console.error('Error deleting product:', error);

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
});



module.exports = router;