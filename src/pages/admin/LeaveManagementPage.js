// 📁 src/pages/admin/LeaveManagementPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { HowToReg as LeaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LeaveManagementPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [note, setNote] = useState('');
  const [action, setAction] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // 🧪 Dummy data (replace with API later)
  useEffect(() => {
    setLeaveRequests([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        fromDate: '2025-06-25',
        toDate: '2025-06-28',
        reason: 'Medical Leave',
        status: 'Pending',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        fromDate: '2025-06-26',
        toDate: '2025-06-27',
        reason: 'Family Event',
        status: 'Pending',
      },
    ]);
  }, []);

  const handleOpenDialog = (request, actionType) => {
    setSelectedRequest(request);
    setAction(actionType);
    setNote('');
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedRequest(null);
    setNote('');
    setAction('');
  };

  const handleSubmit = () => {
    if (!selectedRequest) return;
    const updatedRequests = leaveRequests.map((req) =>
      req.id === selectedRequest.id
        ? { ...req, status: action, adminNote: note }
        : req
    );
    setLeaveRequests(updatedRequests);
    handleCloseDialog();
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return <Chip label="✅ Approved" color="success" />;
      case 'Rejected':
        return <Chip label="❌ Rejected" color="error" />;
      default:
        return <Chip label="🕒 Pending" color="default" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔙 Back Button */}
      <Button
        variant="outlined"
        startIcon={<BackIcon />}
        onClick={() => navigate('/admin')}
        sx={{ mb: 2 }}
      >
        Back to Admin Panel
      </Button>

      {/* Header */}
      <Paper
        elevation={4}
        sx={{
          mb: 4,
          px: 4,
          py: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #e91e63, #f06292)',
          color: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <LeaveIcon sx={{ mr: 1 }} fontSize="large" />
          Leave Application Management
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Review all submitted leave requests and take appropriate actions with notes.
        </Typography>
      </Paper>

      {/* Leave Request Cards */}
      <Grid container spacing={3}>
        {leaveRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.id}>
            <Card
              elevation={6}
              sx={{
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  👤 {request.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📧 {request.email}
                </Typography>
                <Typography variant="body2">
                  📅 <strong>From:</strong> {request.fromDate}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📅 <strong>To:</strong> {request.toDate}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📝 <strong>Reason:</strong> {request.reason}
                </Typography>

                <Box sx={{ mt: 1 }}>{getStatusChip(request.status)}</Box>

                {request.adminNote && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    🧾 <strong>Admin Note:</strong> {request.adminNote}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleOpenDialog(request, 'Approved')}
                    disabled={request.status !== 'Pending'}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleOpenDialog(request, 'Rejected')}
                    disabled={request.status !== 'Pending'}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Approval/Reject with Note */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{action === 'Approved' ? '✅ Approve' : '❌ Reject'} Leave</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Add Admin Note"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color={action === 'Approved' ? 'success' : 'error'}
            onClick={handleSubmit}
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveManagementPage;
