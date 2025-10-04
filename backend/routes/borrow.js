import express from 'express';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Borrow a book..
router.post('/:bookId', authenticate, async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for borrowing' });
    }

    const user = await User.findById(userId);
    
    // Check if user already borrowed this book and hasn't returned it
    const existingBorrow = user.borrowedBooks.find(
      borrow => borrow.book.toString() === bookId && !borrow.returned
    );

    if (existingBorrow) {
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Update book available copies
    book.availableCopies -= 1;
    await book.save();

    // Add to user's borrowed books
    user.borrowedBooks.push({
      book: bookId,
      dueDate,
      returned: false
    });

    await user.save();

    res.json({ 
      message: 'Book borrowed successfully', 
      dueDate 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Return a book
router.post('/return/:bookId', authenticate, async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const borrowRecord = user.borrowedBooks.find(
      borrow => borrow.book.toString() === bookId && !borrow.returned
    );

    if (!borrowRecord) {
      return res.status(400).json({ message: 'No active borrow record found for this book' });
    }

    // Update borrow record
    borrowRecord.returned = true;
    borrowRecord.returnDate = new Date();

    // Update book available copies
    await Book.findByIdAndUpdate(bookId, { 
      $inc: { availableCopies: 1 } 
    });

    await user.save();

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's borrowed books
router.get('/my-books', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('borrowedBooks.book', 'title author isbn imageUrl');

    const borrowedBooks = user.borrowedBooks
      .filter(borrow => !borrow.returned)
      .map(borrow => ({
        ...borrow.toObject(),
        isOverdue: new Date() > new Date(borrow.dueDate)
      }));

    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get borrow history..
router.get('/history', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('borrowedBooks.book', 'title author isbn imageUrl');

    res.json(user.borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;