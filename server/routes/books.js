const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ error: 'Error fetching books.' });
  }
});

// Add a book
router.post('/', async (req, res) => {
    try {
      const { isbn, title, authors, image, description, status } = req.body;
  
      // Validate required fields
      if (!isbn || !title) {
        return res.status(400).json({ error: 'ISBN and title are required.' });
      }
  
      // Validate and set default for status
      const validStatuses = ['To Read', 'Reading', 'Finished'];
      const bookStatus = validStatuses.includes(status) ? status : 'To Read';
  
      // Check for duplicate ISBN
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ error: 'Book with this ISBN already exists.' });
      }
  
      // Create and save the new book
      const book = new Book({ isbn, title, authors, image, description, status: bookStatus });
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      console.error('Error saving book:', error.message);
  
      // Handle MongoDB validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Invalid data format.' });
      }
  
      res.status(500).json({ error: 'Error saving book.' });
    }
    console.log('Incoming Request Body:', req.body); // Log the received payload

  });
  

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ error: 'Error deleting book.' });
  }
});

// Update the reading status of a book
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['To Read', 'Reading', 'Finished'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated book
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    res.json(book);
  } catch (error) {
    console.error('Error updating book status:', error.message);
    res.status(500).json({ error: 'Error updating book status.' });
  }
});

module.exports = router;
