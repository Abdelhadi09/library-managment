import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const BorrowListManagement = () => {
  const { user } = useContext(UserContext);
  const [borrowList, setBorrowList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the borrow list from the backend
  const fetchBorrowList = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/borrows', {
       
      });
      setBorrowList(response.data);
    } catch (err) {
      console.error('Error fetching borrow list:', err.message);
      setError('Failed to load borrow list.');
    } finally {
      setLoading(false);
    }
  };

  // Update borrow status
  const updateStatus = async (borrowId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/borrows/${borrowId}`,
        { status },
        { headers: { Authorization: user.token } }
      );
      setBorrowList((prev) =>
        prev.map((borrow) =>
          borrow._id === borrowId ? { ...borrow, status } : borrow
        )
      );
    } catch (err) {
      console.error('Error updating borrow status:', err.message);
      alert('Failed to update borrow status.');
    }
  };

  useEffect(() => {
    fetchBorrowList();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: '20px' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: 'var(--bg-color)', // Dynamic background color
        color: 'var(--text-color)', // Dynamic text color
      }}
    >
      <Typography variant="h4" gutterBottom>
        Borrow List Management
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'var(--paper-bg)', // Dynamic table background
          color: 'var(--text-color)', // Dynamic text color
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>User</strong></TableCell>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Book</strong></TableCell>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Borrow Date</strong></TableCell>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Due Date</strong></TableCell>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Status</strong></TableCell>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowList.map((borrow) => (
              <TableRow key={borrow._id}>
                <TableCell sx={{ color: 'var(--text-color)' }}>{borrow.user.username}</TableCell>
                <TableCell sx={{ color: 'var(--text-color)' }}>
                  {borrow.bookTitle || borrow.book?.title || 'Unknown Title'}
                </TableCell>
                <TableCell sx={{ color: 'var(--text-color)' }}>
                  {new Date(borrow.borrowDate).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: 'var(--text-color)' }}>
                  {new Date(borrow.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: 'var(--text-color)' }}>{borrow.status}</TableCell>
                <TableCell>
                  {borrow.status !== 'returned' && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        marginRight: '10px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--text-color)',
                        '&:hover': {
                          backgroundColor: 'var(--secondary-color)',
                        },
                      }}
                      onClick={() => updateStatus(borrow._id, 'returned')}
                    >
                      Mark as Returned
                    </Button>
                  )}
                  {borrow.status !== 'overdue' && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: 'var(--secondary-color)',
                        color: 'var(--text-color)',
                        '&:hover': {
                          backgroundColor: 'var(--primary-color)',
                        },
                      }}
                      onClick={() => updateStatus(borrow._id, 'overdue')}
                    >
                      Mark as Overdue
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BorrowListManagement;
