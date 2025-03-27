require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});