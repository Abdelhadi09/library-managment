import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import './Home.css'; // Import the CSS file
import BookDetailsModal from "../BookDetailsModal/BookDetailsModal"; 

function Home({ navigateTo }) {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track the current page for infinite scroll
  const [hasMore, setHasMore] = useState(true); // Check if there are more results
  const [error, setError] = useState('');
 const [selectedBook, setSelectedBook] = useState(null); 
  // Fetch featured books from OpenLibrary API
  const fetchFeaturedBooks = async () => {
    if (loading || !hasMore) return; // Avoid duplicate requests

    setLoading(true);
    try {
      const response = await axios.get(
        `https://openlibrary.org/subjects/popular.json?limit=10&offset=${(page - 1) * 10}` // Paginate results using limit and offset
      );
      setFeaturedBooks((prevBooks) => [...prevBooks, ...response.data.works]); // Append new results to previous ones
      setPage((prevPage) => prevPage + 1); // Increment page
      setHasMore(response.data.works.length > 0); // Stop fetching if no results
    } catch (err) {
      console.error('Error fetching featured books:', err);
      setError('Failed to load featured books.');
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        fetchFeaturedBooks();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup listener
  }, [fetchFeaturedBooks]);

  useEffect(() => {
    // Load initial featured books
    fetchFeaturedBooks();
  }, []);

  const openBookDetails = (book) => {
    setSelectedBook(book); // Set the selected book for the modal
  };

  const closeBookDetails = () => {
    setSelectedBook(null); // Close the modal
  };

  return (
    <div className="home-container">
      {/* Banner Section */}
      <div className="home-banner">
        <h1>Welcome to Your Personal Book Library!</h1>
        <p>Discover, save, and track your favorite books with ease.</p>
      </div>

      {/* Featured Books Section */}
      <div>
        <h2 className="featured-title">Featured Books</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="featured-books">
          {featuredBooks.map((book) => (
            <div 
            key={book.key}
             className="book-card"
             onClick={() => openBookDetails(book)}>
              {book.cover_id ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                  alt={book.title}
                  className="book-cover"
                />
              ) : (
                <div className="no-cover">No Cover Available</div>
              )}
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">
                {book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}
              </p>
            </div>
          ))}
          {loading && <p>Loading more books...</p>} {/* Show loading indicator */}
        </div>
      </div>
    </div>
  );
}

export default Home;
