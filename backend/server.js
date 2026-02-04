
const path = require('path');
const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

// Middleware and routes would go here
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '..', '..','frontend', 'index.html'));
});

app.get('/about', (req, res) => {
    res.send('About page' );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});