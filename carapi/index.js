const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Import the cors package

const app = express();
const prisma = new PrismaClient();

const usersRouter = require('./routes/users');
const carsRouter = require('./routes/cars');

app.use(express.json()); // Middleware to parse JSON bodies

// Use cors middleware to handle CORS headers
app.use(cors());

app.use('/api/users', usersRouter); // Use the users router
app.use('/api/cars', carsRouter); // Use the cars router

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
