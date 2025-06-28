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

const dummyUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    isApproved: false,
  },
  {
    _id: '2',
    name: 'Jane Admin',
    email: 'admin@example.com',
    role: 'admin',
    isApproved: true,
  },
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    setUsers(dummyUsers); // Load dummy data initially
  }, []);

  const handleApprove = (id) => {
    const updated = users.map((user) =>
      user._id === id ? { ...user, isApproved: true } : user
    );
    setUsers(updated);
    setSnackbar({ open: true, message: '✅ User approved successfully', severity: 'success' });
  };

  const handleDelete = (id) => {
    const filtered = users.filter((user) => user._id !== id);
    setUsers(filtered);
    setSnackbar({ open: true, message: '🗑️ User deleted', severity: 'info' });
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
