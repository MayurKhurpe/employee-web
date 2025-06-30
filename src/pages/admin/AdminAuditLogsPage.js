// 📁 src/pages/admin/AdminAuditLogsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { Download, PictureAsPdf, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'api/axios';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get('/admin/audit-logs');
      const data = res.data;
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Failed to fetch audit logs', severity: 'error' });
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    const csvRows = [
      ['Timestamp', 'Message'],
      ...filteredLogs.map((log) => [log.timestamp, log.message]),
    ];
    const blob = new Blob(
      [csvRows.map((e) => e.join(',')).join('\n')],
      { type: 'text/csv;charset=utf-8;' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('📜 Audit Logs Report', 14, 16);
    doc.autoTable({
      head: [['Timestamp', 'Message']],
      body: filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.message,
      ]),
      startY: 22,
    });
    doc.save('audit_logs.pdf');
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e8f0fe, #f1f8e9)',
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
          background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1565c0, #2196f3)',
          },
        }}
      >
        Back to Admin Panel
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c387e' }}>
        📜 Audit Logs
      </Typography>

      <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mt: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          mb={2}
        >
          <TextField
            label="Search by message"
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdf />}
            onClick={exportToPDF}
          >
            Export PDF
          </Button>
        </Stack>

        {filteredLogs.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No logs found.
          </Typography>
        ) : (
          <Box>
            {filteredLogs.map((log, idx) => (
              <Paper
                key={idx}
                elevation={2}
                sx={{
                  p: 2,
                  mb: 1.5,
                  backgroundColor: '#f9fbe7',
                  borderLeft: '5px solid #7986cb',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {new Date(log.timestamp).toLocaleString()}
                </Typography>
                <Typography>{log.message}</Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminAuditLogsPage;
