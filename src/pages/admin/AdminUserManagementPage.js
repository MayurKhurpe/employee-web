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
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  CheckCircle,
  Delete,
  ArrowBack,
  Search as SearchIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [summary, setSummary] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    verifiedUsers: 0,
    activeUsers: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/all-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);

      const total = res.data.length;
      const approved = res.data.filter((u) => u.isApproved).length;
      const verified = res.data.filter((u) => u.isVerified).length;
      const active = res.data.filter((u) => u.isApproved && u.isVerified).length;

      setSummary({
        totalUsers: total,
        approvedUsers: approved,
        verifiedUsers: verified,
        activeUsers: active,
      });
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Failed to fetch users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      const res = await axios.post(
        `/admin/approve-user`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: `✅ ${res.data.message}`, severity: 'success' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Approval failed', severity: 'error' });
    }
  };

  const handleVerify = async (email) => {
    try {
      const res = await axios.post(
        `/admin/verify-user`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: `🔐 ${res.data.message}`, severity: 'success' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Verification failed', severity: 'error' });
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await axios.delete(`/admin/delete-user`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { email },
      });
      setSnackbar({ open: true, message: `🗑️ ${res.data.message}`, severity: 'info' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Delete failed', severity: 'error' });
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredUsers.map((u) => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      'Blood Group': u.bloodGroup || '—',
      'Joining Date': u.joiningDate ? new Date(u.joiningDate).toLocaleDateString('en-GB') : '—',
      Approved: u.isApproved ? 'Yes' : 'No',
      Verified: u.isVerified ? 'Yes' : 'No',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Seekers_Users.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredUsers.map((u) => [
      u.name,
      u.email,
      u.role,
      u.bloodGroup || '—',
      u.joiningDate ? new Date(u.joiningDate).toLocaleDateString('en-GB') : '—',
      u.isApproved ? 'Yes' : 'No',
      u.isVerified ? 'Yes' : 'No',
    ]);

    doc.autoTable({
      head: [['Name', 'Email', 'Role', 'Blood Group', 'Joining Date', 'Approved', 'Verified']],
      body: tableData,
    });

    doc.save('Seekers_Users.pdf');
  };

  const columns = [
    { field: 'name', headerName: '👤 Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: '📧 Email', flex: 1.5, minWidth: 200 },
    { field: 'bloodGroup', headerName: '🩸 Blood Group', width: 140 },
    {
      field: 'joiningDate',
      headerName: '📅 Joining Date',
      width: 160,
      valueGetter: (params) =>
        params.row.joiningDate ? new Date(params.row.joiningDate).toLocaleDateString('en-GB') : '—',
    },
    { field: 'role', headerName: '🛡️ Role', width: 130 },
    {
      field: 'isApproved',
      headerName: '✅ Approved',
      width: 130,
      renderCell: (params) => (params.row.isApproved ? '✅ Yes' : '❌ No'),
    },
    {
      field: 'isVerified',
      headerName: '🔐 Verified',
      width: 130,
      renderCell: (params) => (params.row.isVerified ? '🔓 Yes' : '🔒 No'),
    },
    {
      field: 'actions',
      headerName: '⚙️ Actions',
      width: 220,
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
          {!params.row.isVerified && (
            <Tooltip title="Verify User">
              <IconButton onClick={() => handleVerify(params.row.email)} color="primary">
                <VerifiedIcon />
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
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(to bottom right, #e0f7fa, #f1f8e9)', backdropFilter: 'blur(8px)' }}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mb: 4, backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)' }}>
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
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Approve and verify users, or manage user accounts.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="primary">Total Users</Typography>
              <Typography variant="h5" fontWeight="bold">{summary.totalUsers}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#dcedc8', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="success.main">Approved Users</Typography>
              <Typography variant="h5" fontWeight="bold">{summary.approvedUsers}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff9c4', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="warning.main">Verified Users</Typography>
              <Typography variant="h5" fontWeight="bold">{summary.verifiedUsers}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffcdd2', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="error.main">Active Users</Typography>
              <Typography variant="h5" fontWeight="bold">{summary.activeUsers}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />
      </Paper>

      <Paper elevation={2} sx={{ borderRadius: 2, p: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(6px)' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="contained" color="success" onClick={handleExportExcel}>
            📊 Export Excel
          </Button>
          <Button variant="contained" color="error" onClick={handleExportPDF}>
            🖨️ Export PDF
          </Button>
        </Box>

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
