import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import Home from './components/home/Home';
import SearchBooks from './components/searchBooks/SearchBooks';
import Library from './components/library/Library';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResponsiveAppBar from './components/ResponsiveAppBar/ResponsiveAppBar'; // Import the AppBar
import './App.css';

function App() {
  // Theme state for light/dark mode
  const [theme, setTheme] = useState('light');

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme); // Apply theme to <html> element
  };

  // On initial load, get the theme from localStorage or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <UserProvider>
      <Router>
        {/* Pass theme and toggleTheme to the AppBar */}
        <ResponsiveAppBar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/searchbooks" element={<SearchBooks />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
