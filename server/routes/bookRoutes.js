const express = require('express');
const Book = require('../models/Book'); // Your Book model
const router = express.Router();

/**
 * GET /api/books
 * Fetch all books.
 */
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ error: 'Failed to fetch books.' });
  }
});

/**
 * POST /api/books
 * Add a new book.
 */
router.post('/', async (req, res) => {
  const { title, author, genre, available } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required.' });
  }

  try {
    const newBook = new Book({ title, author, genre, available });
    await newBook.save();
    res.status(201).json({ message: 'Book added successfully!', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error.message);
    res.status(500).json({ error: 'Failed to add book.' });
  }
});

/**
 * PUT /api/books/:id
 * Update book details.
 */
router.put('/:id', async (req, res) => {
  const { title, author, genre, available } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, genre, available },
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    res.json({ message: 'Book updated successfully!', book: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error.message);
    res.status(500).json({ error: 'Failed to update book.' });
  }
});

/**
 * DELETE /api/books/:id
 * Delete a book.
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    res.json({ message: 'Book deleted successfully!' });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ error: 'Failed to delete book.' });
  }
});

module.exports = router;
