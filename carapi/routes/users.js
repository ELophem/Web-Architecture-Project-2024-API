const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

router.post('/', async (req, res) => {
  const { username, password, name, lastName, email, isAdmin } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, name, lastName, email, isAdmin }
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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { username: user.username, isAdmin: user.isAdmin },
      'your_secret_key',
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
