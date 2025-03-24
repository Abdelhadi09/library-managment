const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    authors: { type: [String], default: [] },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { 
      type: String, 
      enum: ['To Read', 'Reading', 'Finished'], 
      default: 'To Read'  // Default status for new books
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', BookSchema);
