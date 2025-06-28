import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Fade
} from '@mui/material';
import { History as HistoryIcon, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const res = await axios.get('/api/login-history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to load login history:', err);
        setSnackbar({ open: true, msg: '❌ Failed to load login history.' });
      } finally {
        setLoading(false);
      }
    };
    fetchLoginHistory();
  }, []);

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 700,
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>🕓 Login History</Typography>
            <Button
              onClick={() => navigate('/settings')}
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{
                textTransform: 'none',
                borderRadius: '30px',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              Back to Settings
            </Button>
          </Box>

          {loading ? (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          ) : history.length > 0 ? (
            <List>
              {history.map((item, i) => (
                <Tooltip
                  key={item._id || i}
                  title={`🗓️ ${item.date}\n📍 Location: ${item.location || 'N/A'}`}
                  arrow
                  placement="right"
                >
                  <ListItem
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: '#f9f9f9',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'scale(1.01)',
                        backgroundColor: '#fff',
                      },
                      transition: '0.2s ease-in-out'
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        <HistoryIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 'bold' }}>{item.browser}</Typography>}
                      secondary={`IP: ${item.ip || 'N/A'} | ${item.date}`}
                    />
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          ) : (
            <Typography align="center">😕 No login history found.</Typography>
          )}

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="info" variant="filled" sx={{ width: '100%' }}>
              {snackbar.msg}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </Fade>
  );
};

export default LoginHistoryPage;
