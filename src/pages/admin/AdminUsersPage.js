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

  useEffect(() => {
    setUsers(dummyUsers); // Load dummy users initially
  }, []);

  const handleApprove = (id) => {
    const updated = users.map((user) =>
      user._id === id ? { ...user, isApproved: true } : user
    );
    setUsers(updated);
  };

  const handleDelete = (id) => {
    const filtered = users.filter((user) => user._id !== id);
    setUsers(filtered);
  };

  return (
    <Box sx={{ p: 3, background: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        👥 Manage Users
      </Typography>

      <Paper elevation={3} sx={{ overflowX: 'auto', borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
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
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminUsersPage;
