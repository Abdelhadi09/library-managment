// src/routes/userRoutes.js

const express = require('express');
const User = require('../models/User'); // Your User model
// If you have middleware for checking librarian privileges, import it here. For example:
// const adminAuth = require('../middleware/adminAuth');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/users
 * Retrieve the list of all users.
 */
router.get('/', /* adminAuth, */ async (req, res) => {
  try {
    // Find all users and exclude the password field
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

/**
 * GET /api/users/:id
 * Retrieve details of a single user.
 */
router.get('/:id', /* adminAuth, */ async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ error: 'Failed to fetch user details.' });
  }
});

/**
 * PUT /api/users/:id
 * Update a user's details.
 */
router.put('/:id', /* adminAuth, */ async (req, res) => {
  const { username, email } = req.body;

  // Basic validation
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true, select: '-password' } // Return updated user without password field
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user.
 */
router.delete('/:id', /* adminAuth, */ async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
