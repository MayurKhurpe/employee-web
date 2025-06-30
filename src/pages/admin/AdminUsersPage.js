// 📁 src/pages/admin/AdminUsersPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Chip,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'api/axios'; // ✅ Centralized Axios

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const token = localStorage.getItem('token');

  // ✅ Load Users from Backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: '❌ Failed to fetch users',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Approve User
  const handleApprove = async (id) => {
    try {
      await axios.put(`/admin/users/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: '✅ User approved successfully', severity: 'success' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Approval failed', severity: 'error' });
    }
  };

  // ✅ Delete User
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: '🗑️ User deleted', severity: 'info' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Delete failed', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4, background: 'linear-gradient(to right, #f5f7fa, #e0f7fa)', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1565c0' }}>
        👥 Manage Users
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3, mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
            <TableRow>
              <TableCell><strong>👤 Name</strong></TableCell>
              <TableCell><strong>📧 Email</strong></TableCell>
              <TableCell><strong>🛡️ Role</strong></TableCell>
              <TableCell><strong>✅ Status</strong></TableCell>
              <TableCell align="right"><strong>⚙️ Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.toUpperCase()}
                      color={user.role === 'admin' ? 'info' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isApproved ? 'Approved' : 'Pending'}
                      color={user.isApproved ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {!user.isApproved && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  ❌ No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUsersPage;
