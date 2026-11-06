var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const User = require('../models/user.model');
const jsonwebtoken = require('jsonwebtoken');
const tokenmiddleware = require('../middleware/token.middleware.js')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resourceeee');
});


//POST /api/v1/login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    if (!name || !password) {
    return res.status(400).json({
        status: 400,
        message: 'Name and password are required',
        data: null
    });
    } 
    const user = await mongoose.model('users').findOne({ name });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // ตรวจสอบสถานะ Approve
    if (user.is_Approved !== true) {
      return res.status(401).json({
        status: 401,
        message: 'Account is waiting for approval',
        data: null
    });
    } 
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//[POST] /api/v1/register
router.post('/register', async (req, res) => {
  const { name, password } = req.body;

  try {
    if (!name || !password) {
      return res.status(400).json({
        status: 400,
        message: 'Name and password are required',
        data: null
      });
    }

    // Check if the user already exists
    const existingUser = await mongoose.model('users').findOne({ name });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: 'User already exists',
        data: null
      });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with isApproved set to false
    const newUser = new User({
      name,
      password: hashedPassword,
      is_Approved: false // Set isApproved to false for new users
    });

    await newUser.save(); 
    return res.status(201).json({
      status: 201,
      message: 'User registered successfully',
      data: {
          id: newUser._id,
          name: newUser.name,
          is_Approved: newUser.is_Approved
      }
  });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }



}); 


//PUT /api/v1/users/:id/approve
router.put('/users/:id/approve', tokenmiddleware, async (req, res) => {
  const userId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid user ID',
                data: null
            });
        }

        const admin = await mongoose.model('users')
            .findById(req.user.userId);

        if (!admin || admin.role !== 'admin') {
            return res.status(401).json({
                status: 401,
                message: 'Admin access required',
                data: null
            });
        }
    const user = await mongoose.model('users').findById(userId);

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'User not found',
        data: null
      });
    }

    // Update the isApproved field to true
    user.is_Approved = true;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'User approved successfully',
      data: {
          id: user._id,
          name: user.name,
          is_Approved: user.is_Approved
      }
  });
  } catch (error) {
    console.error('Error during approval:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
}); 
module.exports = router;
