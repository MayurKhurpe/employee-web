// 📁 src/pages/admin/AdminUserManagementPage.js
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
  TextField,
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  CheckCircle,
  Delete,
  ArrowBack,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios'; // ✅ Centralized Axios

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Failed to fetch users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Live Filter
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleApprove = async (email) => {
    try {
      const res = await axios.put(
        `/admin/users/approve-by-email`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: `✅ ${res.data.message}`, severity: 'success' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Approval failed', severity: 'error' });
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await axios.delete(`/admin/users/delete-by-email`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { email },
      });
      setSnackbar({ open: true, message: `🗑️ ${res.data.message}`, severity: 'info' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Delete failed', severity: 'error' });
    }
  };

  const columns = [
    { field: 'name', headerName: '👤 Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: '📧 Email', flex: 1.5, minWidth: 200 },
    { field: 'role', headerName: '🛡️ Role', width: 130 },
    {
      field: 'isApproved',
      headerName: '✅ Approved',
      width: 130,
      renderCell: (params) => (params.row.isApproved ? '✅ Yes' : '❌ No'),
    },
    {
      field: 'actions',
      headerName: '⚙️ Actions',
      width: 160,
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
        background: 'linear-gradient(to bottom right, #e0f7fa, #f1f8e9)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* 🔙 Header */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: 4,
          mb: 4,
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin')}
          sx={{
            mb: 2,
            background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
            color: '#fff',
            fontWeight: 'bold',
            px: 2.5,
            py: 1.2,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(90deg, #1e88e5, #00bcd4)',
            },
          }}
        >
          Back to Admin Panel
        </Button>

        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.dark">
          👥 User Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Approve new users, search, and manage employee accounts.
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Paper>

      {/* 🔍 Search + Table */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <TextField
          placeholder="🔍 Search by name or email"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 520 }}>
            <DataGrid
              rows={filteredUsers.map((user, index) => ({ id: index + 1, ...user }))}
              columns={columns}
              pageSize={7}
              rowsPerPageOptions={[7]}
              disableSelectionOnClick
              getRowHeight={() => 'auto'}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#e3f2fd',
                  fontWeight: 'bold',
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* ✅ Snackbar */}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUserManagementPage;
