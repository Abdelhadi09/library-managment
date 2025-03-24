import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await axios.post('/api/auth/register', { username, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000); // Redirect to Login after 2 seconds
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to register.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-button">Register</button>
      </form>
      {success && <p className="auth-success">Registration successful! Redirecting to login...</p>}
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}

export default Register;
