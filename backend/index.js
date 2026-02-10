const express = require('express');
const { connect } = require('http2');
const path = require('path');
const connectDB = require('./connectDb/ConnectDb');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/landing.html'));
});



connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});