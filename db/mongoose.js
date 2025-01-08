const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGODB_URL); 

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
}); 

mongoose.connection.on('error', (err) => {  
    console.error('MongoDB connection error:', err);
});
module.exports = mongoose;