// routes/statRoutes.js
const express = require('express');
const router = express.Router();
const Borrow = require('../models/Borrow');  // Ensure the path is correct
const User = require('../models/User');      // Ensure the path is correct

router.get('/', async (req, res) => {
  try {
    // Set a fixed value for totalBooks
    const totalBooks = 10;

    // Query the Borrow collection for the count of borrowed books (status "borrowed")
    const borrowedBooks = await Borrow.countDocuments();

    // Query the Borrow collection for the count of overdue books (status "overdue")
    const overdueBooks = await Borrow.countDocuments({ status: 'overdue' });

    // Query the User collection for the total number of users
    const totalUsers = await User.countDocuments();

    res.json({
      totalBooks,
      borrowedBooks,
      overdueBooks,
      totalUsers,
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

module.exports = router;
