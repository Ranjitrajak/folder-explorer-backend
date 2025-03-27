const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI||'mongodb+srv://Ranjit:Password%40123@cluster0.7dtkr4l.mongodb.net/folderdb?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  };

module.exports = connectDB;