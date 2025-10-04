
import express from 'express';
import { body, validationResult } from 'express-validator';
import Book from '../models/Book.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all books..
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', genre = '' } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single book..
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create book (Admin only)..
router.post('/', [
  authenticate,
  authorize('admin'),
  body('title').notEmpty().trim(),
  body('author').notEmpty().trim(),
  body('isbn').notEmpty().trim(),
  body('genre').notEmpty().trim(),
  body('publishedYear').isInt({ min: 1000, max: new Date().getFullYear() }),
  body('totalCopies').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bookData = {
      ...req.body,
      availableCopies: req.body.totalCopies
    };

    const existingBook = await Book.findOne({ isbn: bookData.isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }

    const book = new Book(bookData);
    await book.save();

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update book (Admin only)..
router.put('/:id', [
  authenticate,
  authorize('admin'),
  body('title').optional().notEmpty().trim(),
  body('author').optional().notEmpty().trim(),
  body('genre').optional().notEmpty().trim(),
  body('publishedYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('totalCopies').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Prevent ISBN update to avoid duplicates
    const { isbn, ...updateData } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete book (Admin only)..
router.delete('/:id', [authenticate, authorize('admin')], async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;