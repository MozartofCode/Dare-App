
require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user'); // Import User model

const port = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// User registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = new User({ email, password });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/postDare', async (req, res) => {
    const { email, dare } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.dares.push(dare);
        await user.save();
        res.status(200).json({ message: 'Dare posted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get the money/points earned by the user
app.post('/getScore', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ score: user.score });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});




