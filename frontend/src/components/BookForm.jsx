import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: new Date().getFullYear(),
    publisher: '',
    description: '',
    totalCopies: 1,
    genre: 'Academic' // Default to Academic
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`);
      const bookData = response.data;
      
      setFormData({
        title: bookData.title || '',
        author: bookData.author || '',
        publishedYear: bookData.publishedYear || new Date().getFullYear(),
        publisher: bookData.publisher || '',
        description: bookData.description || '',
        totalCopies: bookData.totalCopies || 1,
        genre: bookData.genre || 'Academic'
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('Error loading book data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' || name === 'totalCopies' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.author.trim()) {
      setError('Author is required');
      setLoading(false);
      return;
    }

    if (!formData.publisher.trim()) {
      setError('Publisher is required');
      setLoading(false);
      return;
    }

    if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear()) {
      setError('Published year must be between 1000 and current year');
      setLoading(false);
      return;
    }

    if (formData.totalCopies < 1) {
      setError('Total copies must be at least 1');
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await axios.put(`/api/books/${id}`, formData);
        alert('Book updated successfully!');
      } else {
        const bookData = {
          ...formData,
          isbn: `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          availableCopies: formData.totalCopies
        };
        await axios.post('/api/books', bookData);
        alert('Book added successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving book:', error);
      setError(error.response?.data?.message || 'Error saving book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form">
      <h2>{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
      
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="book-title">Title *</label>
          <input
            type="text"
            id="book-title"
            name="title"
            autoComplete="off"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter book title"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="book-author">Author *</label>
          <input
            type="text"
            id="book-author"
            name="author"
            autoComplete="off"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Enter author name"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="book-year">Published Year *</label>
            <input
              type="number"
              id="book-year"
              name="publishedYear"
              autoComplete="off"
              value={formData.publishedYear}
              onChange={handleChange}
              min="1000"
              max={new Date().getFullYear()}
              required
              placeholder="2024"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-copies">Total Copies *</label>
            <input
              type="number"
              id="book-copies"
              name="totalCopies"
              autoComplete="off"
              value={formData.totalCopies}
              onChange={handleChange}
              min="1"
              required
              placeholder="1"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="book-publisher">Publisher *</label>
          <input
            type="text"
            id="book-publisher"
            name="publisher"
            autoComplete="off"
            value={formData.publisher}
            onChange={handleChange}
            required
            placeholder="Enter publisher name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="book-genre">Genre *</label>
          <select
            id="book-genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-select"
          >
            <option value="Academic">Academic</option>
            <option value="Non-Academic">Non-Academic</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="book-description">Description</label>
          <textarea
            id="book-description"
            name="description"
            autoComplete="off"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter book description (optional)"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="btn secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn primary"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Book' : 'Add Book')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;