import React, { useEffect, useState } from 'react';
import './BookDetailsModal.css';

function BookDetailsModal({ book, onClose }) {
  const [reviews, setReviews] = useState([]); // State for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/works/${book.key}.json`);
        const data = await response.json();
        if (data.reviews) {
          setReviews(data.reviews); // Extract reviews if available
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to fetch reviews.');
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [book.key]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{book.title}</h2>
        {book.cover_i && (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
            alt={book.title}
            className="modal-book-cover"
          />
        )}
        <p><strong>Authors:</strong> {book.author_name?.join(', ') || 'Unknown Author'}</p>
        <p><strong>Published:</strong> {book.first_publish_year || 'Unknown Year'}</p>

        {loading && <p>Loading reviews...</p>}
        {error && <p className="error-message">{error}</p>}
        {reviews.length > 0 ? (
          <div className="reviews-section">
            <h3>Reviews:</h3>
            <ul>
              {reviews.map((review, index) => (
                <li key={index}>
                  <p>{review.content}</p>
                  <p><strong>By:</strong> {review.reviewer}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && <p>No reviews available for this book.</p>
        )}
      </div>
    </div>
  );
}

export default BookDetailsModal;
