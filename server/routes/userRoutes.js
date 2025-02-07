const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, password } = req.body;
    console.log('Register request received:', { name });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, password: hashedPassword });
        await user.save();
        console.log('User registered successfully:', name);
        res.status(201).json('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json('Error registering user');
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    console.log('Login request received:', { name });
    console.log('Request body:', req.body);

    try {
        const user = await User.findOne({ name });
        if (user && await bcrypt.compare(password, user.password)) {
            console.log('User logged in successfully:', name);
            res.status(200).json({ name: user.name, isAdmin: user.isAdmin });
        } else {
            console.warn('Invalid login credentials for:', name);
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(400).send('Error logging in');
    }
});


module.exports = router;

