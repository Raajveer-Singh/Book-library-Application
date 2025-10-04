import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching borrowed books...');
      
      const response = await axios.get('/api/borrow/my-books');
      console.log('Borrowed books response:', response.data);
      
      // Ensure we have an array, even if empty
      setBorrowedBooks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      setError(error.response?.data?.message || 'Failed to load your borrowed books');
      setBorrowedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await axios.post(`/api/borrow/return/${bookId}`);
      alert('Book returned successfully!');
      fetchBorrowedBooks(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || 'Error returning book');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return 0;
    try {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>My Borrowed Books</h2>
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        <button 
          onClick={fetchBorrowedBooks}
          className="btn primary"
          style={{ marginTop: '1rem' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="my-books">
      <h2>My Borrowed Books</h2>
      
      {borrowedBooks.length === 0 ? (
        <div className="empty-state">
          <h3>No Books Borrowed</h3>
          <p>You haven't borrowed any books yet.</p>
          <p>Browse our collection to find your next read!</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn primary"
            style={{ marginTop: '1rem' }}
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="borrowed-books-list">
          {borrowedBooks.map((borrow, index) => {
            const daysRemaining = calculateDaysRemaining(borrow.dueDate);
            const isOverdue = daysRemaining < 0;
            
            return (
              <div key={borrow._id || index} className={`borrowed-book-card ${isOverdue ? 'overdue' : ''}`}>
                {borrow.book?.imageUrl && (
                  <img 
                    src={borrow.book.imageUrl} 
                    alt={borrow.book.title || 'Book cover'} 
                    className="book-image-small" 
                  />
                )}
                
                <div className="book-details">
                  <h3>{borrow.book?.title || 'Unknown Book'}</h3>
                  <p className="author">by {borrow.book?.author || 'Unknown Author'}</p>
                  
                  <div className="borrow-info">
                    <p>
                      <strong>Borrowed on:</strong> {formatDate(borrow.borrowedDate)}
                    </p>
                    <p className={isOverdue ? 'due-date overdue' : 'due-date'}>
                      <strong>Due date:</strong> {formatDate(borrow.dueDate)}
                      {isOverdue ? (
                        <span className="overdue-badge">
                          OVERDUE by {Math.abs(daysRemaining)} days
                        </span>
                      ) : (
                        <span style={{ color: '#27ae60', marginLeft: '0.5rem' }}>
                          ({daysRemaining} days remaining)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="return-action">
                  <button 
                    onClick={() => handleReturn(borrow.book?._id || borrow.book)}
                    className="btn primary"
                    style={{ width: '100%' }}
                  >
                    Return Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBooks;