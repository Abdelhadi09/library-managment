import React, { useState, useContext } from "react";
import axios from "axios";
import "./SearchBooks.css"; // Import the CSS file
import BookDetailsModal from "../BookDetailsModal/BookDetailsModal"; // Import the modal component
import { UserContext } from "../../context/UserContext";

function SearchBooks() {
  const { user } = useContext(UserContext); // Access the token from the UserContext
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [year, setYear] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Track the selected book for the modal
  const [message, setMessage] = useState("");
  const [sortBy, setSortBy] = useState("");

  const genreOptions = [
    { value: "", label: "Genres" },
    { value: "fiction", label: "Fiction" },
    { value: "science", label: "Science" },
    { value: "history", label: "History" },
    { value: "fantasy", label: "Fantasy" },
    { value: "romance", label: "Romance" },
  ];

  const languageOptions = [
    { value: "", label: "Languages" },
    { value: "eng", label: "English" },
    { value: "fre", label: "French" },
    { value: "spa", label: "Spanish" },
    { value: "ger", label: "German" },
    { value: "ita", label: "Italian" },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setSearchResults([]);

    try {
      const params = new URLSearchParams();
      if (isbn.trim()) params.append("isbn", isbn);
      if (title.trim()) params.append("title", title);
      if (author.trim()) params.append("author", author);
      if (genre.trim()) params.append("subject", genre);
      if (language.trim()) params.append("language", language);
      if (year.trim()) params.append("first_publish_year", year);

      const response = await axios.get(
        `https://openlibrary.org/search.json?${params.toString()}`
      );
      let results = response.data.docs;

      if (results.length === 0) {
        setMessage("No books found for the given criteria.");
        return;
      }

      if (sortBy) {
        results = applySorting(results, sortBy);
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setMessage(error.response?.data?.error || "Error searching books.");
    }
  };

  const applySorting = (results, sortBy) => {
    const sortedResults = [...results];
    switch (sortBy) {
      case "title":
        sortedResults.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        sortedResults.sort((a, b) => {
          const authorA = a.author_name ? a.author_name[0] : "";
          const authorB = b.author_name ? b.author_name[0] : "";
          return authorA.localeCompare(authorB);
        });
        break;
      case "year":
        sortedResults.sort(
          (a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0)
        );
        break;
      default:
        break;
    }
    return sortedResults;
  };

  const openBookDetails = (book) => {
    setSelectedBook(book); // Set the selected book for the modal
  };

  const closeBookDetails = () => {
    setSelectedBook(null); // Close the modal
  };

  // Save a book to the library
  const transformBookData = (book) => ({
    isbn: book.isbn !== "N/A" ? book.isbn : "Unknown",
    title: book.title || "Untitled",
    authors: book.author_name || [],
    image: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "",
    // Use OpenLibrary cover API
    description: book.first_sentence
      ? book.first_sentence[0]
      : "No description available",
    status: "To Read",
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
  return (
    <div className="search-books-container">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Enter Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="search-input"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="search-select"
        >
          {genreOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="search-select"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="sorting-options">
        <label>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="">None</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="year">Year</option>
        </select>
      </div>

      {message && (
        <p
          className={`message ${
            message.includes("Error") ? "error" : "success"
          }`}
        >
          {message}
        </p>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((book, index) => (
            <div
              key={index}
              className="book-card"
              onClick={() => openBookDetails(book)}
            >
              {book.cover_i && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="book-image"
                />
              )}
              <h3 className="book-title">{book.title}</h3>
              <p className="book-authors">
                {book.author_name
                  ? book.author_name.join(", ")
                  : "Unknown Author"}
              </p>
              <button className="save-button" onClick={() => saveBook(book)}>
                {" "}
                Save{" "}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Render the modal if a book is selected */}
      {selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={closeBookDetails} />
      )}
    </div>
  );
}

export default SearchBooks;
