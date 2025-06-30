// 📁 src/pages/admin/AdminReportsPage.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  InsertDriveFile,
  PictureAsPdf,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
// import axios from '../../api/axios'; // 🛡️ Enable when backend is ready

const AdminReportsPage = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // 🧪 Replace this with real backend call later
  const reportData = [
    { Name: 'John Doe', Email: 'john@example.com', Status: 'Present' },
    { Name: 'Jane Smith', Email: 'jane@example.com', Status: 'Absent' },
    { Name: 'Ravi Patel', Email: 'ravi@company.com', Status: 'Late' },
  ];

  const handleDownloadCSV = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'employee-report.csv');
    setSnackbar({ open: true, message: '📥 CSV Report Downloaded!', severity: 'success' });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('📊 Employee Attendance Report', 10, 15);

    doc.setFontSize(12);
    reportData.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.Name} | ${item.Email} | ${item.Status}`, 10, 30 + index * 10);
    });

    doc.save('employee-report.pdf');
    setSnackbar({ open: true, message: '📥 PDF Report Downloaded!', severity: 'success' });
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e0f7fa, #eceff1)',
      }}
    >
      {/* 🔙 Back Button */}
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

      {/* 📊 Heading */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
        📊 Reports
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          mt: 2,
          borderRadius: 3,
          backgroundColor: '#ffffffd9',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Typography variant="body1" fontSize={16} gutterBottom>
          Choose a format to download the employee attendance report:
        </Typography>

        <Stack direction="row" spacing={2} mt={2}>
          <Button
            variant="contained"
            startIcon={<InsertDriveFile />}
            onClick={handleDownloadCSV}
            sx={{
              background: 'linear-gradient(45deg, #00bcd4, #2196f3)',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #0288d1, #1976d2)',
              },
            }}
          >
            Download CSV
          </Button>

          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={handleDownloadPDF}
            sx={{
              borderColor: '#e53935',
              color: '#e53935',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#ffebee',
              },
            }}
          >
            Download PDF
          </Button>
        </Stack>
      </Paper>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminReportsPage;
