// 📁 src/pages/admin/AdminUserDetailPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'api/axios';

const AdminUserDetailPage = () => {
  const { id } = useParams(); // ✅ Get user ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user details
  const fetchUser = async () => {
    try {
      const res = await axios.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch user details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          ❌ User not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(to bottom right, #f5f7fa, #e0f7fa)' }}>
      {/* ✅ Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/admin/users')}
        sx={{
          mb: 3,
          background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
          color: '#fff',
          fontWeight: 'bold',
          px: 2.5,
          py: 1.2,
          borderRadius: 2,
          '&:hover': { background: 'linear-gradient(90deg, #1e88e5, #00bcd4)' },
        }}
      >
        Back to User Management
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          👤 User Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Name:</strong></Typography>
            <Typography>{user.name || '—'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Email:</strong></Typography>
            <Typography>{user.email || '—'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Role:</strong></Typography>
            <Typography>{user.role || '—'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Status:</strong></Typography>
            <Typography>{user.isApproved ? '✅ Approved' : '❌ Pending'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Blood Group:</strong></Typography>
            <Typography>{user.bloodGroup || '—'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Joining Date:</strong></Typography>
            <Typography>
              {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString('en-GB') : '—'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Phone:</strong></Typography>
            <Typography>{user.phone || '—'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Verified:</strong></Typography>
            <Typography>{user.isVerified ? '🔓 Yes' : '🔒 No'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminUserDetailPage;
