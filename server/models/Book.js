const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    authors: { type: [String], default: [] },
    image: { type: String, default: '' },
    genre: { type: String, default: '' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', BookSchema);
