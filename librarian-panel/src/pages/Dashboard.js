// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch statistics from the backend
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err.message);
      setError('Failed to load stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Prepare data for the PieChart (for demonstration, we assume available books are defined as totalBooks - borrowedBooks)
  const pieData = stats
    ? [
        { name: 'Borrowed', value: stats.borrowedBooks },
        { name: 'Overdue', value: stats.overdueBooks },
        { name: 'Available', value: stats.totalBooks - stats.borrowedBooks },
      ]
    : [];

  const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : stats ? (
        <Grid container spacing={3}>
          {/* KPI Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white' }}>
              <CardContent>
                <Typography variant="subtitle1">Total Books</Typography>
                <Typography variant="h4">{stats.totalBooks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#f44336', color: 'white' }}>
              <CardContent>
                <Typography variant="subtitle1">Borrowed Books</Typography>
                <Typography variant="h4">{stats.borrowedBooks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#ff9800', color: 'white' }}>
              <CardContent>
                <Typography variant="subtitle1">Overdue Books</Typography>
                <Typography variant="h4">{stats.overdueBooks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#4caf50', color: 'white' }}>
              <CardContent>
                <Typography variant="subtitle1">Total Users</Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pie Chart for Borrow Status */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Borrow Status Overview
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography>No statistics available.</Typography>
      )}
    </Box>
  );
};

export default Dashboard;
