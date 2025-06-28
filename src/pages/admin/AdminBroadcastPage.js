import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminBroadcastPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [history, setHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch('/api/admin/broadcasts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Failed to fetch broadcasts', severity: 'error' });
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      return setSnackbar({ open: true, message: 'Please enter a message.', severity: 'warning' });
    }

    try {
      const res = await fetch('/api/admin/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, audience }),
      });

      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: data.message || 'Sent successfully!', severity: 'success' });
        setMessage('');
        setAudience('all');
        setHistory([data.data, ...history]);
      } else {
        throw new Error(data.error || 'Failed to send');
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/broadcasts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setHistory((prev) => prev.filter((log) => log._id !== id));
      setSnackbar({ open: true, message: '✅ Deleted successfully', severity: 'info' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fce4ec, #e3f2fd)',
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/admin')}
        sx={{
          mb: 2,
          px: 2.5,
          py: 1.2,
          fontWeight: 'bold',
          fontSize: '0.95rem',
          background: 'linear-gradient(90deg, #3949ab, #5c6bc0)',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(63,81,181,0.3)',
          '&:hover': {
            background: 'linear-gradient(90deg, #303f9f, #3f51b5)',
          },
        }}
      >
        Back to Admin Panel
      </Button>

      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.dark">
        📢 Broadcast Message
      </Typography>

      <Paper sx={{ mt: 2, p: 3, borderRadius: 3, backgroundColor: '#fff8', backdropFilter: 'blur(4px)' }}>
        <Stack spacing={2}>
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <TextField
            select
            label="Audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="employee">Only Employees</MenuItem>
            <MenuItem value="admin">Only Admins</MenuItem>
          </TextField>

          <Button
            variant="contained"
            onClick={handleSend}
            sx={{
              width: 'fit-content',
              alignSelf: 'flex-end',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #43cea2, #185a9d)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(to right, #2b5876, #4e4376)',
              },
            }}
          >
            🚀 Send Broadcast
          </Button>
        </Stack>
      </Paper>

      {/* Broadcast History */}
      <Typography variant="h6" mt={4} mb={1} fontWeight="bold">
        🕓 Broadcast History
      </Typography>
      {history.length === 0 ? (
        <Typography>No messages sent yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {history.map((log) => (
            <Paper key={log._id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography fontWeight="bold">{log.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(log.createdAt).toLocaleString()} • Audience: {log.audience}
                </Typography>
              </Box>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(log._id)} color="error">
                  <Delete />
                </IconButton>
              </Tooltip>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminBroadcastPage;
