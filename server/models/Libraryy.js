const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [
    {
      title: { type: String, required: true },
      authors: [String],
      isbn: { type: String },
      image: { type: String, default: '' },
      status: { type: String, enum: ['To Read', 'Reading', 'Finished'], default: 'To Read' },
    },
  ],
});

module.exports = mongoose.model('Libraryy', LibrarySchema);
