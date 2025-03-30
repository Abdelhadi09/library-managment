// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import BorrowListManagement from './pages/BorrowListManagement';
import BorrowBook from './pages/BorrowBook';
import './App.css';
import { UserProvider } from './context/UserContext';

function App() {
  // Set up theme state; default to light mode
  const [theme, setTheme] = useState('dark');

  // On mount, load the saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Update theme in localStorage and on the document when changed
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <UserProvider>
      <Router>
        <AdminLayout theme={theme} toggleTheme={toggleTheme}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/borrows" element={<BorrowListManagement />} />
            <Route path="/borrow-book" element={<BorrowBook />} />
            {/* <Route path="/books" element={<BookManagement />} /> */}
          </Routes>
        </AdminLayout>
      </Router>
    </UserProvider>
  );
}

export default App;
