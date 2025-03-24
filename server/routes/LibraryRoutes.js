const express = require('express');
const Library = require('../models/Libraryy');
const authMiddleware = require('../middleware/authMiddleware');
const Libraryy = require('../models/Libraryy');

const router = express.Router();

// Get user's library
router.get('/', authMiddleware, async (req, res) => {
  try {
    const library = await Libraryy.findOne({ userId: req.userId });
    if (!library) return res.status(404).json({ error: 'Library not found.' });
    res.json(library);
  } catch (error) {
    console.error('Error fetching library:', error.message);
    res.status(500).json({ error: 'Error fetching library.' });
  }
});

// Add a book to user's library
router.post('/add', authMiddleware, async (req, res) => {
  const { title, authors, isbn ,image, status } = req.body;

  // Validate required fields
  if (!title && !isbn && !status) {
    return res.status(400).json({ error: 'Missing required fields: title, isbn, or status.' });
  }

  try {
    let library = await Libraryy.findOne({ userId: req.userId });
    if (!library) {
      library = new Libraryy({ userId: req.userId, books: [] });
    }

    // Prevent duplicate books
    // const isDuplicate = library.books.some(book => book.isbn === isbn);
    // if (isDuplicate) {
    //   return res.status(400).json({ error: 'Book already exists in the library.' });
    // }

    // Add book to library
    library.books.push({ title, authors, isbn, image, status });
    await library.save();
    res.json({ message: 'Book added to library!' });
  } catch (error) {
    console.error('Error adding book to library:', error); // Log full error stack
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});
// Update book status in user's library
router.patch('/update/:bookId', authMiddleware, async (req, res) => {
  const { status } = req.body; // Retrieve status from the body
  const { bookId } = req.params; // Retrieve bookId from the URL

  // Validate required fields
  if (!status) {
    return res.status(400).json({ error: 'Missing required field: status.' });
  }

  try {
    // Find the user's library
    const library = await Libraryy.findOne({ userId: req.userId });
    if (!library) {
      return res.status(404).json({ error: 'Library not found.' });
    }

    // Find the book by ID within the user's library
    const book = library.books.id(bookId); // Use Mongoose's subdocument method
    if (!book) {
      return res.status(404).json({ error: 'Book not found in the library.' });
    }

    // Update the status of the book
    book.status = status;
    await library.save(); // Save changes to the database
    res.json({ status: book.status, message: 'Book status updated successfully!' });
  } catch (error) {
    console.error('Error updating book status:', error); // Log full error stack
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});
// Remove a book from user's library
router.delete('/remove/:bookId', authMiddleware, async (req, res) => {
  const { bookId } = req.params; // Retrieve bookId from the URL

  try {
    // Find the user's library
    const library = await Libraryy.findOne({ userId: req.userId });
    if (!library) {
      return res.status(404).json({ error: 'Library not found.' });
    }

    // Check if the book exists in the library
    const bookIndex = library.books.findIndex(book => book._id.toString() === bookId);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found in the library.' });
    }

    // Remove the book by filtering it out of the books array
    library.books.splice(bookIndex, 1); // Remove book from the array
    await library.save(); // Save changes to the database

    res.json({ message: 'Book removed from library successfully!' });
  } catch (error) {
    console.error('Error removing book from library:', error.stack); // Log the error stack for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});


module.exports = router;
