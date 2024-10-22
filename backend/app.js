
require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const app = express();

console.log('Mongo URI:', process.env.MONGO_URI);

const port = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));





// Basic route
app.post('/login', (req, res) => {
 
    const { email, password } = req.body;
    // DATABASE CHECK
});


// Basic route
app.post('/register', (req, res) => {

    // Put the data in the database

});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});