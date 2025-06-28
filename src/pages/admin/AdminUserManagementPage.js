import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircle, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (email) => {
    try {
      const res = await fetch('/api/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSnackbar({ open: true, message: data.message, severity: 'success' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: 'Approval failed', severity: 'error' });
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSnackbar({ open: true, message: data.message, severity: 'info' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'isApproved',
      headerName: 'Approved',
      width: 120,
      renderCell: (params) => (params.row.isApproved ? '✅ Yes' : '❌ No'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <>
          {!params.row.isApproved && (
            <Tooltip title="Approve User">
              <IconButton onClick={() => handleApprove(params.row.email)} color="success">
                <CheckCircle />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete User">
            <IconButton onClick={() => handleDelete(params.row.email)} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #d9f4ff, #cfd8dc)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 3,
          p: 4,
          mb: 4,
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
            background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
            color: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(33, 203, 243, 0.3)',
            '&:hover': {
              background: 'linear-gradient(90deg, #1e88e5, #00bcd4)',
              boxShadow: '0 6px 12px rgba(0, 188, 212, 0.4)',
            },
          }}
        >
          Back to Admin Panel
        </Button>

        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#0d47a1' }}>
          👥 User Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Approve new users, view details, or remove accounts.
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Paper>

      {/* Data Table */}
      <Paper
        elevation={2}
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          p: 2,
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 500 }}>
            <DataGrid
              rows={users.map((user, index) => ({ id: index + 1, ...user }))}
              columns={columns}
              pageSize={7}
              rowsPerPageOptions={[7]}
              disableSelectionOnClick
              getRowHeight={() => 'auto'}
            />
          </Box>
        )}
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUserManagementPage;
