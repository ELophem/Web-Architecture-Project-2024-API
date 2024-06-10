const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// GET /api/cars
router.get('/', async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// POST /api/cars
router.post('/', async (req, res) => {
  const { manufacturer, model, pictures, description, price, location, userId } = req.body;

  try {
    const car = await prisma.car.create({
      data: {
        manufacturer,
        model,
        pictures,
        description,
        price,
        location,
        userId,
      },
    });

    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// PUT /api/cars/:id
router.put('/:id', async (req, res) => {
  const carId = parseInt(req.params.id);
  const { manufacturer, model, pictures, description, price, location } = req.body;

  try {
    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: {
        manufacturer,
        model,
        pictures,
        description,
        price,
        location,
      },
    });

    res.json(updatedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


const verifyAdminToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    req.userId = decoded.id;
    next();
  });
};


router.delete('/:id', verifyAdminToken, async (req, res) => {
  const carId = parseInt(req.params.id);

  try {
    await prisma.car.delete({
      where: { id: carId },
    });

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = router;
