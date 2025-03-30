const express = require('express');
const Borrow = require('../models/Borrow'); // Assume you have a Borrow model
const User = require('../models/User'); // User schema
const router = express.Router();
const axios = require('axios');

/**
 * GET /api/borrows
 * Get a list of all borrowed books.
 */
router.get('/', async (req, res) => {
    try {
      const borrowList = await Borrow.find().populate('user'); // Populate user details
      // Map through borrowList to fetch book titles from OpenLibrary
      const borrowListWithBookDetails = await Promise.all(
        borrowList.map(async (borrow) => {
          let bookDetails = {};
          if (borrow.book.startsWith('/')) {
            // Fetch book details from OpenLibrary API
            const openLibraryResponse = await axios.get(`https://openlibrary.org${borrow.book}.json`);
            bookDetails = openLibraryResponse.data;
          }
          return {
            ...borrow.toObject(),
            bookTitle: bookDetails.title || 'Unknown Title', // Default title if missing
          };
        })
      );
      res.json(borrowListWithBookDetails);
    } catch (error) {
      console.error('Error fetching borrow list:', error.message);
      res.status(500).json({ error: 'Failed to fetch borrow list.' });
    }
  });
  

/**
 * PUT /api/borrows/:id
 * Update the status of a borrow record.
 */
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedBorrow = await Borrow.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: 'Borrow status updated.', borrow: updatedBorrow });
  } catch (error) {
    console.error('Error updating borrow status:', error.message);
    res.status(500).json({ error: 'Failed to update borrow status.' });
  }
});




/**
 * POST /api/borrows
 * Create a new borrow record.
 */
router.post('/', async (req, res) => {
  const { userId, bookId, dueDate } = req.body;

  if (!userId || !bookId || !dueDate) {
    return res.status(400).json({ error: 'User ID, Book ID, and Due Date are required.' });
  }

  try {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Create the borrow record
    const newBorrow = new Borrow({
      user: userId,
      book: bookId,
      dueDate,
    });

    await newBorrow.save();
    res.status(201).json({ message: 'Borrow record created successfully.', borrow: newBorrow });
  } catch (error) {
    console.error('Error creating borrow record:', error.message);
    res.status(500).json({ error: 'Failed to create borrow record.' });
  }
});



module.exports = router;
