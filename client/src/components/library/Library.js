import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Library.css"; // Import the CSS file
import { UserContext } from "../../context/UserContext"; // Import the UserContext
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { motion, AnimatePresence } from 'framer-motion';

function Library() {
  const { user } = useContext(UserContext); // Access the token from the UserContext
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const updateStatus = async (bookId, status) => {
    if (!user || !user.token) {
      setMessage("You must be logged in to update book status.");
      return;
    }

    try {
      const response = await axios.patch(
        `/api/library/update/${bookId}`,
        {status },
        {
          headers: { Authorization: user.token }, // Include token in headers
        }
      );
      setBooks(
        books.map((book) =>
          book._id === bookId ? { ...book, status: response.data.status } : book
        )
      );
      setMessage("Book status updated.");
    } catch (error) {
      console.error("Update status error:", error);
      setMessage("Error updating book status.");
    }
  };
  // Fetch the library data when the component mounts
  useEffect(() => {
    const loadLibrary = async () => {
      setMessage("");
      if (!user || !user.token) {
        setMessage("You must be logged in to view your library.");
        return;
      }

      try {
        const response = await axios.get("/api/library", {
          headers: { Authorization: user.token }, // Include token in headers
        });
        setBooks(response.data.books || []); // Fetch user-specific books
      } catch (error) {
        console.error("Error fetching library:", error);
        setMessage("Error fetching library.");
      }
    };

    loadLibrary();
  }, [user]);

  // const removeBook = async (isbn) => {
  //   if (!user || !user.token) {
  //     setMessage("You must be logged in to remove books.");
  //     return;
  //   }
  
  //   try {
  //     // Mark the book as being removed by adding a `removing` flag for CSS animation
  //     setBooks((prevBooks) =>
  //       prevBooks.map((book) =>
  //         book.isbn === isbn ? { ...book, isRemoving: true } : book
  //       )
  //     );
  
  //     // Wait for the animation to complete (300ms)
  //     setTimeout(async () => {
  //       // Send DELETE request with the appropriate authorization header (note the Bearer prefix)
  //       await axios.delete(`/api/library/remove/${isbn}`, {
  //         headers: { Authorization: user.token }
  //       });
  
  //       // Re-fetch the library data to update the UI
  //       //await fetchLibrary();
  // //window.location.reload();
  //       // Display success message
  //       setMessage("Book removed from library.");
  //     }, 300);
  //   } catch (error) {
  //     console.error("Remove error:", error.response?.data || error.message);
  //     setMessage("Error removing book.");
  //   }
  // };
  const removeBook = async (book) => {
    if (!user || !user.token) {
      setMessage("You must be logged in to remove books.");
      return;
    }
  
    try {
      // Mark the book as being removed to trigger CSS animation
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b._id === book._id ? { ...b, isRemoving: true } : b))
      );
  
      // Wait for the CSS animation to complete (300ms)
      setTimeout(async () => {
        // Delete the book using its unique _id
        await axios.delete(`/api/library/remove/${book._id}`, {
          headers: { Authorization: user.token},
        });
  
        await fetchLibrary(); // Re-fetch the library data to update the UI
        setMessage("Book removed from library.");
      }, 300);
    } catch (error) {
      console.error("Remove error:", error.response?.data || error.message);
      setMessage("Error removing book.");
    }
  };
  
  
  const fetchLibrary = async () => {
    setMessage(""); // Clear previous messages
    if (!user || !user.token) {
      setMessage("You must be logged in to view your library.");
      return;
    }
  
    try {
      const response = await axios.get("/api/library", {
        headers: { Authorization: user.token },
      });
      setBooks(response.data.books || []); // Update state with the latest data
    } catch (error) {
      console.error("Error fetching library:", error.response?.data || error.message);
      setMessage("Error fetching library.");
    }
  };
  
  return (
    <div className="library-container">
      <h2>My Library</h2>
      {message && (
        <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
      {books.length === 0 ? (
        <p>No books saved.</p>
      ) : (
        <TransitionGroup className="book-list">
          {books.map((book) => (
            <CSSTransition
              key={book._id}
              timeout={300}
              classNames="fade"
            >
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`Book-card ${book.isRemoving ? 'removing' : ''}`}
              >
                {/* Delete Button at Top-Right Corner */}
                <button className="delete-button" onClick={() => removeBook(book)}>
                  Delete
                </button>
                {/* Book Details */}
                {book.image && (
                  <img src={book.image} alt={book.title} className="book-image" />
                )}
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p>
                    <strong>Authors:</strong> {book.authors && book.authors.length > 0 ? book.authors.join(", ") : "N/A"}
                  </p>
                  <p>{book.description}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${book.status.replace(" ", "-").toLowerCase()}`}>
                      {book.status}
                    </span>
                  </p>
                  <div className="status-buttons">
                    <button
                      className={`status-button ${book.status === "To Read" ? "active" : ""}`}
                      onClick={() => updateStatus(book._id, "To Read")}
                    >
                      To Read
                    </button>
                    <button
                      className={`status-button ${book.status === "Reading" ? "active" : ""}`}
                      onClick={() => updateStatus(book._id, "Reading")}
                    >
                      Reading
                    </button>
                    <button
                      className={`status-button ${book.status === "Finished" ? "active" : ""}`}
                      onClick={() => updateStatus(book._id, "Finished")}
                    >
                      Finished
                    </button>
                  </div>
                </div>
              </motion.div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}
    </div>
  );
}  
export default Library;
