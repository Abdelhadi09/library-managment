import React, { useEffect, useState ,useContext} from 'react';
import axios from 'axios';
import './Home.css'; // Import CSS for styling
import BookDetailsModal from "../BookDetailsModal/BookDetailsModal";
import { CircularProgress, Box ,Button} from '@mui/material'; // Import Material-UI components
import { UserContext } from "../../context/UserContext";
function Home({ navigateTo }) {
  const { user } = useContext(UserContext);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('fiction'); // Default subject
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // To display in the modal
  const [message, setMessage] = useState("");

  // Subjects to choose from
  const subjects = [
    { label: 'Fiction', value: 'fiction' },
    { label: 'Science', value: 'science' },
    { label: 'Fantasy', value: 'fantasy' },
    { label: 'Mystery', value: 'mystery' },
    { label: 'Romance', value: 'romance' },
  ];

  // Fetch books for the selected subject - load only the first 20 books
  const fetchBooksBySubject = async () => {
    setLoading(true); // Start the loading animation
    setError('');
    try {
      const response = await axios.get(
        `https://openlibrary.org/subjects/${subject}.json?limit=20&offset=0`
      );
      // Only include books with covers for a nicer UI.
      const filteredBooks = response.data.works.filter(
        (book) => book.cover_id
      );
      setFeaturedBooks(filteredBooks);
    } catch (err) {
      console.error('Error fetching books:', err.message);
      setError('Failed to load books.');
    } finally {
      setLoading(false); // Stop the loading animation
    }
  };

  // When the subject changes, fetch the first 20 books for that subject.
  useEffect(() => {
    fetchBooksBySubject();
  }, [subject]);

  
  const transformBookData = (book) => ({
    isbn: book.isbn !== "N/A" ? book.isbn : "Unknown",
    title: book.title || "Untitled",
    authors: book.authors[0].name || [],
    image: book.cover_id
      ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
      : "",
    // Use OpenLibrary cover API
    description: book.first_sentence
      ? book.first_sentence[0]
      : "No description available",
    status: "To Read",
    published: book.first_publish_year || "Unknown Year",
    // Default value for new books
  });
  const saveBook = async (book) => {
    if (!user || !user.token) {
      setMessage("You must be logged in to save books.");
      return;
    }
    try {
      const transformedBook = transformBookData(book);
      console.log("Transformed book:", transformedBook);
      await axios.post(
        "/api/library/add",
        transformedBook,
        { headers: { Authorization: user.token } }
        // Include token in headers
      );
      setMessage(`Saved "${transformedBook.title}" to your library.`);
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Error saving book.");
    }
  };

  const openBookDetails = (book) => {
    console.log("Selected book:", book);
    const transformedBook = transformBookData(book);
    console.log("Transformed book:", transformedBook);
    setSelectedBook(transformedBook); // Set the selected book for the modal
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
  };

  return (
    <div className="home-container">
      {/* Banner Section */}
      <div className="home-banner">
        <h1>Welcome to Your Personal Book Library!</h1>
        <p>Discover, save, and track your favorite books with ease.</p>
      </div>

      {/* Subject Buttons */}
      <div className="subject-buttons">
        {subjects.map((subj) => (
          <button
            key={subj.value}
            onClick={() => setSubject(subj.value)}
            className={`subject-button ${subject === subj.value ? 'active' : ''}`}
            disabled={loading} // Disable buttons while loading
          >
            {subj.label}
          </button>
        ))}
      </div>

      {/* Loading Animation */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <CircularProgress color="primary" /> {/* Display the spinner */}
        </Box>
      )}

      {/* Featured Books Section */}
      {!loading && (
        <div>
          <h2 className="featured-title">
            {`${subject.charAt(0).toUpperCase() + subject.slice(1)} Books`}
          </h2>
          {error && <p className="error-message">{error}</p>}
          <div className="featured-books">
            {featuredBooks.map((book) => (
              <div
                key={book.key}
                className="book-card"
              >
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
                  {book.authors && book.authors.length > 0
                    ? book.authors[0].name
                    : 'Unknown Author'}
                </p>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => openBookDetails(book)}
                  >
                    Details
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => saveBook(book)}
                  >
                    Save
                  </Button>
                </Box>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={closeBookDetails} />
      )}
    </div>
  );
}

export default Home;