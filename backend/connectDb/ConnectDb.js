const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async () => {
    try {
        // Mongoose 6+ no longer requires (or accepts) useNewUrlParser/useUnifiedTopology options.
        // Provide an explicit database name in the URI and let Mongoose handle modern defaults.
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

module.exports = connectDB;