import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const BorrowBook = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the list of users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  // Search for books using OpenLibrary API
  const searchBooks = async () => {
    if (!bookSearch) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${bookSearch}`);
      const books = response.data.docs.slice(0, 10).map((book) => ({
        id: book.key,
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        coverUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : 'https://via.placeholder.com/150', // Placeholder for missing covers
      }));
      setBooks(books);
    } catch (err) {
      console.error('Error fetching books:', err.message);
      setError('Failed to load books.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleBorrow = async () => {
    if (!selectedUser || !selectedBook || !dueDate) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/borrows',
        {
          userId: selectedUser,
          bookId: selectedBook.id,
          dueDate,
        },
        { headers: { Authorization: user.token } }
      );
      alert('Book successfully borrowed!');
    } catch (err) {
      console.error('Error borrowing book:', err.message);
      alert('Failed to borrow book.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    console.log('Updated Selected Book:', book); // Verify state update
  };

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: 'var(--bg-color)', // Dynamic background color
        color: 'var(--text-color)', // Dynamic text color
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 'bold',
          color: 'var(--text-color)',
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        Borrow Book
      </Typography>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
      {error && (
        <Typography
          color="error"
          sx={{
            textAlign: 'center',
            marginTop: 2,
            fontWeight: 'bold',
          }}
        >
          {error}
        </Typography>
      )}
      {!loading && (
        <Box>
          {/* User Selection */}
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Select User</Typography>
            <TextField
              select
              fullWidth
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'var(--paper-bg)',
                  borderRadius: '8px',
                  padding: '10px',
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-color)',
                },
              }}
            >
              <option value="" disabled 
                sx={{
                  color: 'var(--text-color)',
                }}>
                Choose a user
              </option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </TextField>
          </Box>
          {/* Book Search */}
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Search for a Book</Typography>
            <TextField
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              fullWidth
              placeholder="Enter book title or author"
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'var(--paper-bg)',
                  borderRadius: '8px',
                  padding: '10px',
                },
              }}
            />
            <Button
              onClick={searchBooks}
              variant="contained"
              sx={{
                marginTop: '10px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-color)',
                color: 'var(--text-color)',
                padding: '10px 15px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'var(--secondary-color)',
                },
              }}
            >
              Search
            </Button>
          </Box>
          {/* Book List */}
          {books.length > 0 && (
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >
                Available Books
              </Typography>
              <Grid container spacing={3}>
                {books.map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'var(--paper-bg)',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={book.coverUrl}
                        alt={`${book.title} cover`}
                        sx={{
                          borderRadius: '12px 12px 0 0',
                        }}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 'bold',
                            color: 'var(--text-color)',
                          }}
                        >
                          {book.title}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{
                            color: 'var(--text-color)',
                            fontStyle: 'italic',
                          }}
                        >
                          {book.author}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: 'var(--primary-color)',
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            '&:hover': {
                              backgroundColor: 'var(--secondary-color)',
                            },
                          }}
                          onClick={() => handleSelectBook(book)}
                        >
                          Select Book
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {/* Selected Book */}
          {selectedBook && (
            <Box
              sx={{
                marginTop: '20px',
                padding: '10px',
                backgroundColor: 'var(--paper-bg)',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">Selected Book:</Typography>
              <Typography>{selectedBook.title} by {selectedBook.author}</Typography>
            </Box>
          )}
          {/* Due Date */}
          <Box sx={{ marginBottom: '20px', marginTop: '20px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Due Date</Typography>
            <TextField
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'var(--paper-bg)',
                  borderRadius: '8px',
                  padding: '10px',
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-color)',
                },
              }}
            />
          </Box>
          {/* Borrow Button */}
          <Button
            variant="contained"
            onClick={handleBorrow}
            sx={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--text-color)',
              padding: '10px 15px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'var(--secondary-color)',
              },
            }}
          >
            Borrow Book
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default BorrowBook;