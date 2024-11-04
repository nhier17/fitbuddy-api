// connect to the db
const mongoose = require('mongoose');
const connectDB = (url) => {
    return mongoose
     .connect(url)
     .then(() => console.log('MongoDB Connected...'))
     .catch((err) => console.error(`MongoDB connection error: ${err.message}`));
}

module.exports = connectDB;