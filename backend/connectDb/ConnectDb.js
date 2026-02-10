const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = async () => {
    try {
        // Mongoose 6+ no longer requires (or accepts) useNewUrlParser/useUnifiedTopology options.
        // Provide an explicit database name in the URI and let Mongoose handle modern defaults.
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://tom:tom123@pjw.mmzvsw1.mongodb.net/pjw?appName=PJW" );
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

module.exports = connectDB;