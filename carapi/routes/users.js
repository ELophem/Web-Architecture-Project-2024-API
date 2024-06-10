const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  const { username, password, name, lastName, email, isAdmin } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { username, password, name, lastName, email, isAdmin }
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
    res.status(200).json({ message: 'Authentication successful' });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


module.exports = router;
