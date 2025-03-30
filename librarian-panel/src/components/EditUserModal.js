import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';

const EditUserModal = ({ open, onClose, user, onSave }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!username || !email) {
      setError('Username and email are required.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        username,
        email,
      });
      onSave(response.data.user); // Pass updated user to the parent
      onClose(); // Close modal
    } catch (err) {
      console.error('Error updating user:', err.message);
      setError('Failed to update user.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-user-modal"
      aria-describedby="edit-user-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'var(--paper-bg)', // Dynamic background color
          color: 'var(--text-color)', // Dynamic text color
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          padding: 4,
        }}
      >
        <Typography
          variant="h6"
          id="edit-user-modal"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 2,
          }}
        >
          Edit User
        </Typography>
        <TextField
          margin="normal"
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'var(--bg-color)', // Dynamic input background
              color: 'var(--text-color)', // Dynamic input text color
            },
            '& .MuiInputLabel-root': {
              color: 'var(--text-color)',
            },
          }}
        />
        <TextField
          margin="normal"
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'var(--bg-color)', // Dynamic input background
              color: 'var(--text-color)', // Dynamic input text color
            },
            '& .MuiInputLabel-root': {
              color: 'var(--text-color)',
            },
          }}
        />
        {error && (
          <Typography
            color="error"
            sx={{
              textAlign: 'center',
              marginTop: 2,
            }}
          >
            {error}
          </Typography>
        )}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: 'var(--primary-color)',
              color: 'var(--primary-color)',
              '&:hover': {
                borderColor: 'var(--secondary-color)',
                color: 'var(--secondary-color)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: 'var(--primary-color)', // Dynamic button color
              color: 'var(--text-color)',
              '&:hover': {
                backgroundColor: 'var(--secondary-color)', // Hover color
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
