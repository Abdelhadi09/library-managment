const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/books');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const libraryRoutes = require('./routes/LibraryRoutes'); // Import library routes
const userRoutes = require('./routes/userRoutes'); // Import user routes
const borrowRoutes = require('./routes/borrowRoutes'); // Import borrow routes
const booksRoutes = require('./routes/bookRoutes'); // Import book routes
const statRoutes = require('./routes/statRoutes');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'src')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes); // Add auth routes
app.use('/api/library', libraryRoutes); // Add library routes
app.use('/api/users', userRoutes); // Add user routes
app.use('/api/borrows', borrowRoutes); // Add borrow routes
app.use('/api/bookss', booksRoutes); // Add book routes
app.use('/api/stats', statRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
