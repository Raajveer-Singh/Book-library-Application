import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import MyBooks from './components/MyBooks';
import BorrowHistory from './components/BorrowHistory';
import './App.css';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<BookList />} />
              <Route 
                path="/my-books" 
                element={
                  <ProtectedRoute userOnly={true}>
                    <MyBooks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute userOnly={true}>
                    <BorrowHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books/add" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <BookForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books/edit/:id" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <BookForm />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;