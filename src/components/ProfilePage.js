import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';

export default function ProfilePage({ updateUser }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    mobile: '',
    emergencyMobile: '',
    bloodGroup: '',
    department: '',
    joiningDate: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: 'success',
    message: '',
  });

  // ✅ Load Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        updateUser && updateUser(res.data);
      } catch (err) {
        setSnackbar({
          open: true,
          type: 'error',
          message: err.response?.data?.error || '❌ Failed to load profile',
        });
      }
    };
    fetchProfile();
  }, [updateUser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: '', type: 'success' });

    // 🔐 Validations
    if (!/^\d{10}$/.test(profile.mobile)) {
      return setSnackbar({
        open: true,
        type: 'error',
        message: '📱 Invalid mobile number (10 digits)',
      });
    }
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      return setSnackbar({
        open: true,
        type: 'error',
        message: '📧 Invalid email format',
      });
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile((prev) => ({ ...prev, ...res.data }));
      localStorage.setItem('user', JSON.stringify(res.data));
      updateUser && updateUser(res.data);

      setSnackbar({
        open: true,
        type: 'success',
        message: '☁️ Profile saved to cloud!',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        type: 'error',
        message: err.response?.data?.error || '❌ Failed to update profile',
      });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: 'url("https://i.postimg.cc/Yq51br7t/MES.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      {/* Blur Layer */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(30px)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0,
        }}
      />

      <Paper
        elevation={10}
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 3,
          borderRadius: 4,
          maxWidth: 700,
          width: '90%',
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      >
        <Container>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            My Profile 🧑‍💼
          </Typography>

          {/* ✅ No Avatar or Upload */}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {[
              { label: '📝 Name', name: 'name' },
              { label: '📧 Email', name: 'email', type: 'email' },
              { label: '🏠 Address', name: 'address' },
              { label: '📱 Mobile Number', name: 'mobile' },
              { label: '📞 Emergency Contact', name: 'emergencyMobile' },
              { label: '🩸 Blood Group', name: 'bloodGroup' },
              { label: '🏢 Department', name: 'department' },
            ].map((field) => (
              <TextField
                key={field.name}
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                value={profile[field.name]}
                onChange={handleChange}
              />
            ))}

            <TextField
              fullWidth
              type="date"
              label="📅 Joining Date"
              name="joiningDate"
              InputLabelProps={{ shrink: true }}
              value={profile.joiningDate?.substring(0, 10) || ''}
              onChange={handleChange}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 3, py: 1.2 }}
              color="primary"
            >
              💾 Save Changes
            </Button>
          </Box>
        </Container>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.type} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
