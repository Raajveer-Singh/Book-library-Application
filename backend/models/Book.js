
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  genre: {
    type: String,
    enum: ['Academic', 'Non-Academic'], 
    default: 'Academic',
    required: true,
    trim: true
  },
  publishedYear: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear()
  },
  publisher: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

bookSchema.pre('save', function(next) {
  if (this.isModified('totalCopies')) {
    const diff = this.totalCopies - (this._previousTotalCopies || 0);
    this.availableCopies = Math.max(0, (this.availableCopies || 0) + diff);
  }
  next();
});

export default mongoose.model('Book', bookSchema);