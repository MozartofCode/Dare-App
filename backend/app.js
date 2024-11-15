
require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user'); // Import User model

const port = process.env.PORT || 3000;
const axios = require('axios');

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Login and Registration Functions

// Registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = new User({ email, password, score: 0, proposedDares: [], acceptedDares: [] });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Login
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

// Dare Functions

// Post a dare
app.post('/postDare', async (req, res) => {
    const { email, dare } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Checking if the proposed dare by the user is acceptable based on the AI Agents
        axios.post('http://localhost:5000/evaluate_dare', { dare_suggestion: dare })
            .then(response => {
                console.log(response.data);
                if (response.data === 'True') {
                    console.log('Dare is safe');
                }
                else {
                    return res.status(400).json({ message: 'Dare is not safe or not provable! Try again...' });
                }
            })
            .catch(error => {
                console.error(error);
            });
        
        user.proposedDares.push(dare);
        await user.save();
        res.status(200).json({ message: 'Dare posted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get the dares proposed by every user
app.get('/getProposedDares', async (req, res) => {
    try {
        const users = await User.find().select('proposedDares');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Suggestions for dares
app.get('/getDareSuggestion', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/suggest_dare');
        const dareSuggestion = response.data;
        res.status(200).json({ message: dareSuggestion });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Accepting a dare
app.post('/acceptDare', async (req, res) => {
    const { email, dare } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.acceptedDares.push(dare);
        await user.save();
        res.status(200).json({ message: 'Dare accepted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Uploading an image proof for a dare & checking if the dare is accepted
app.post('/uploadProof', async (req, res) => {
    const { email, dare, image_url} = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        axios.post('http://localhost:5000/check_completion', { image_url: image_url, dare_suggested: dare })
            .then(response => {
                console.log(response.data);
                if (response.data === 'Dare is completed!') {
                    console.log('Dare is completed');
                }
                else {
                    return res.status(400).json({ message: 'Dare is not completed! Try again...' });
                }
            })
            .catch(error => {
                console.error(error);
            });

        user.score += 10; 
        await user.save();
        res.status(200).json({ message: 'Dare is completed successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Dashboard Functions

// Get the money/points earned by the user
app.get('/getScore', async (req, res) => {
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


// Get top 10 users based on score
app.get('/topScores', async (req, res) => {
    try {
        const topUsers = await User.find().sort({ score: -1 }).limit(10).select('email score');
        res.status(200).json(topUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});