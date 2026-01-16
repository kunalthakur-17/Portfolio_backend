const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()


function connectToMongoDB() {
    return mongoose.connect(process.env.mongodb_url)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
}

module.exports = connectToMongoDB;