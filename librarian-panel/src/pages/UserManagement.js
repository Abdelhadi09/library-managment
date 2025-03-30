import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import EditUserModal from '../components/EditUserModal';

function UserManagement({ theme }) {
  const { user } = useContext(UserContext); // Access the token from the UserContext
  const [users, setUsers] = useState([]); // Store user data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const [message, setMessage] = useState(''); // Message state
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for editing
  const [editModalOpen, setEditModalOpen] = useState(false); // Edit modal state

  // Fetch users from the backend API
  const fetchUsers = async () => {
    setLoading(true); // Set loading state
    setError(''); // Clear previous errors
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
         // Include token in headers
      }); // Replace with your API endpoint
      setUsers(response.data); // Set the user data
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user); // Set selected user for editing
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedUser) => {
    // Update user in state after saving edits
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const handleDeleteClick = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return; // Exit if user cancels
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        // Include token in headers
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err.message);
      alert('Failed to delete user.');
    }
  };

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
        User Management
      </Typography>
      <TableContainer
        sx={{
          backgroundColor: 'var(--paper-bg)', // Dynamic table background
          color: 'var(--text-color)', // Dynamic text color
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Name</strong></TableCell>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Email</strong></TableCell>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Role</strong></TableCell>
              <TableCell sx={{ color: 'var(--text-color)' }}><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell sx={{ color: 'var(--text-color)' }}>{user.username}</TableCell>
                <TableCell sx={{ color: 'var(--text-color)' }}>{user.email}</TableCell>
                <TableCell sx={{ color: 'var(--text-color)' }}>{user.role || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      marginRight: '10px',
                      backgroundColor: 'var(--primary-color)', // Dynamic button color
                      color: 'var(--text-color)', // Dynamic text color
                      '&:hover': {
                        backgroundColor: 'var(--secondary-color)',
                      },
                    }}
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: 'var(--secondary-color)', // Dynamic button color
                      color: 'var(--text-color)', // Dynamic text color
                      '&:hover': {
                        backgroundColor: 'var(--primary-color)',
                      },
                    }}
                    onClick={() => handleDeleteClick(user._id)} // Pass user ID to the function
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Edit User Modal */}
      {editModalOpen && (
        <EditUserModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          user={selectedUser}
          onSave={handleSaveEdit}
        />
      )}
    </Box>
  );
}

export default UserManagement;
