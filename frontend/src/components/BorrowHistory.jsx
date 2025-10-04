import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  const fetchBorrowHistory = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching borrow history...');
      
      const response = await axios.get('/api/borrow/history');
      console.log('History response:', response.data);
      
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      setError(error.response?.data?.message || 'Failed to load borrow history');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your borrow history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>My Borrow History</h2>
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        <button 
          onClick={fetchBorrowHistory}
          className="btn primary"
          style={{ marginTop: '1rem' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="borrow-history">
      <h2>My Borrow History</h2>
      
      {history.length === 0 ? (
        <div className="empty-state">
          <h3>No Borrow History Yet</h3>
          <p>You haven't borrowed any books yet.</p>
          <p>Start exploring our collection to find your next read!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((record, index) => (
            <div key={record._id || index} className="history-item">
              {record.book?.imageUrl && (
                <img 
                  src={record.book.imageUrl} 
                  alt={record.book.title || 'Book cover'} 
                  className="book-image-small" 
                />
              )}
              
              <div className="book-details">
                <h3>{record.book?.title || 'Unknown Book'}</h3>
                <p className="author">by {record.book?.author || 'Unknown Author'}</p>
                
                <div className="history-info">
                  <p>
                    <strong>Borrowed:</strong> {formatDate(record.borrowedDate)}
                  </p>
                  <p>
                    <strong>Due:</strong> {formatDate(record.dueDate)}
                  </p>
                  {record.returned && record.returnDate && (
                    <p>
                      <strong>Returned:</strong> {formatDate(record.returnDate)}
                    </p>
                  )}
                </div>
              </div>

              <div className="status">
                {record.returned ? (
                  <span className="returned-badge">Returned</span>
                ) : (
                  <span 
                    className={new Date() > new Date(record.dueDate) ? 'overdue' : 'borrowed'}
                    style={{ 
                      color: new Date() > new Date(record.dueDate) ? '#e74c3c' : '#f39c12',
                      fontWeight: 'bold'
                    }}
                  >
                    {new Date() > new Date(record.dueDate) ? 'Overdue' : 'Borrowed'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowHistory;