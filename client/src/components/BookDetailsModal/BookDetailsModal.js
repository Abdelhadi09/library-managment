import React from 'react';
import './BookDetailsModal.css';

function BookDetailsModal({ book, onClose }) {

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{book.title}</h2>
        {book.cover_i && (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`|| `${book.image}`}
            alt={book.title}
            className="modal-book-cover"
          />
        )}
         {book.image && (
          <img
            src={ `${book.image}`}
            alt={book.title}
            className="modal-book-cover"
          />
        )}
        <p><strong>Authors:</strong> {book.author_name?.join(', ') || book.authors || 'Unknown Author'}</p>
        <p><strong>Published:</strong> {book.first_publish_year || book.published || 'Unknown Year'}</p>
      </div>
    </div>
  );
}

export default BookDetailsModal;
