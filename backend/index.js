const express = require('express');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

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