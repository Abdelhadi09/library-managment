const mongoose = require('mongoose');

const BorrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type : String, required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
});

module.exports = mongoose.model('Borrow', BorrowSchema);
