import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchBooks();
  }, [search, genre]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (genre) params.genre = genre;

      const response = await axios.get('/api/books', { params });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await axios.post(`/api/borrow/${bookId}`);
      alert('Book borrowed successfully!');
      fetchBooks(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Error borrowing book');
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await axios.delete(`/api/books/${bookId}`);
      alert('Book deleted successfully!');
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting book');
    }
  };

  // Handle edit
  const handleEdit = (bookId) => {
    navigate(`/books/edit/${bookId}`);
  };

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="book-list">
      <h2>Browse Our Book Collection</h2>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          <option value="Academic">Academic</option>
          <option value="Non-Academic">Non-Academic</option>
        </select>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          No books found. {search || genre ? 'Try changing your search filters.' : 'Check back later!'}
        </div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <div key={book._id} className="book-card">
              {book.imageUrl && (
                <img src={book.imageUrl} alt={book.title} className="book-image" />
              )}
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <span className={`genre ${book.genre === 'Academic' ? 'academic' : 'non-academic'}`}>
                  {book.genre}
                </span>
                <p className={`copies ${book.availableCopies === 0 ? 'low' : ''}`}>
                  Available: {book.availableCopies}/{book.totalCopies}
                </p>
                <p className="publisher">Publisher: {book.publisher}</p>
                <p className="year">Year: {book.publishedYear}</p>
                {book.description && (
                  <p className="description">{book.description.substring(0, 100)}...</p>
                )}
                
                <div className="book-actions">
                  {user && user.role === 'user' && (
                    <button
                      onClick={() => handleBorrow(book._id)}
                      disabled={book.availableCopies === 0}
                      className={`btn ${book.availableCopies === 0 ? 'disabled' : 'primary'}`}
                      style={{ width: '100%' }}
                    >
                      {book.availableCopies === 0 ? 'Not Available' : 'Borrow Book'}
                    </button>
                  )}
                  
                  {user && user.role === 'admin' && (
                    <div className="admin-actions">
                      <button 
                        onClick={() => handleEdit(book._id)} 
                        className="btn secondary"
                        style={{ flex: 1 }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(book._id)}
                        className="btn danger"
                        style={{ flex: 1 }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;