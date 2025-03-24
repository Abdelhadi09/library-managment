const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  const { isbn, title, author } = req.query;

  if (!isbn && !title && !author) {
    return res.status(400).json({ error: 'Please provide ISBN, title, or author.' });
  }

  try {
    // If searching by ISBN, prioritize it
    if (isbn) {
      const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
      const response = await axios.get(url);
      const key = `ISBN:${isbn}`;
      if (!response.data[key]) {
        return res.status(404).json({ error: 'Book not found using ISBN.' });
      }
      const bookData = response.data[key];
      return res.json([{
        isbn,
        title: bookData.title || 'No title available',
        authors: bookData.authors ? bookData.authors.map((a) => a.name) : [],
        image: bookData.cover
          ? bookData.cover.medium || bookData.cover.large || bookData.cover.small
          : '',
        description: bookData.description
          ? typeof bookData.description === 'string'
            ? bookData.description
            : bookData.description.value
          : 'No description available',
      }]);
    }

    // If searching by title or author, use the Search API
    const searchQuery = encodeURIComponent(`${title || ''} ${author || ''}`.trim());
    const url = `https://openlibrary.org/search.json?q=${searchQuery}`;
    const response = await axios.get(url);

    if (!response.data.docs || response.data.docs.length === 0) {
      return res.status(404).json({ error: 'No books found.' });
    }

    // Map the results to the desired format
    const results = response.data.docs.slice(0, 10).map((book) => ({
      isbn: book.isbn ? book.isbn[0] : 'N/A',
      title: book.title || 'No title available',
      authors: book.author_name || [],
      image: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : '',
      description: book.first_sentence
        ? typeof book.first_sentence === 'string'
          ? book.first_sentence
          : book.first_sentence[0]
        : 'No description available',
    }));

    return res.json(results);
  } catch (error) {
    console.error('Error searching for books:', error.message);
    res.status(500).json({ error: 'Error searching for books.' });
  }
});

module.exports = router;
