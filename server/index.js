const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const matchRoutes = require('./routes/matchAPI');
const userRoutes = require('./routes/userAPI');
const path = require("path");
require('dotenv').config();

// Connection to database
require('./dbConnection'); 
const app = express();

// Body parser middleware
app.use(express.json());

app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define API routes
//app.use('/matchAPI', matchRoutes);
app.use('/userAPI', userRoutes)

if ('production' === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));