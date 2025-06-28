// 📁 src/pages/AdminPage.js
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Groups as UserIcon,
  Assessment as ReportsIcon,
  Settings as SystemSettingsIcon,
  History as AuditIcon,
  Campaign as BroadcastIcon,
  Event as HolidayIcon,
  HowToReg as AttendanceIcon,
  TimeToLeave as LeaveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  // ✅ Role-based protection
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [navigate]);

  const features = [
    {
      title: 'Leave Application Management',
      desc: 'Review and approve/reject leave requests from employees.',
      icon: <LeaveIcon color="error" />,
      route: '/admin/leave-management',
    },
    {
      title: 'Attendance Management',
      desc: 'View employee attendance across the organization.',
      icon: <AttendanceIcon color="info" />,
      route: '/admin/attendance',
    },
    {
      title: 'User Management',
      desc: 'Approve, reject, or manage employee accounts.',
      icon: <UserIcon color="primary" />,
      route: '/admin/users',
    },
    {
      title: 'Reports',
      desc: 'Generate and export system usage reports.',
      icon: <ReportsIcon color="success" />,
      route: '/admin/reports',
    },
    {
      title: 'System Settings',
      desc: 'Manage roles, backups, and permissions.',
      icon: <SystemSettingsIcon color="warning" />,
      route: '/admin/settings',
    },
    {
      title: 'Audit Logs',
      desc: 'View login history and activity tracking.',
      icon: <AuditIcon color="secondary" />,
      route: '/admin/audit',
    },
    {
      title: 'Broadcast Message',
      desc: 'Send a message to all users instantly.',
      icon: <BroadcastIcon color="error" />,
      route: '/admin/broadcast',
    },
    {
      title: 'Holiday & Events',
      desc: 'Add and manage office holidays & events.',
      icon: <HolidayIcon color="info" />,
      route: '/admin/holidays',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("https://i.postimg.cc/Yq51br7t/MES.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        p: 3,
      }}
    >
      {/* 🔲 Blur overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 0,
        }}
      />

      {/* 🧩 Main content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Paper
          elevation={4}
          sx={{
            mb: 4,
            px: 4,
            py: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
            color: '#fff',
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminIcon sx={{ mr: 1 }} fontSize="large" />
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Manage users, attendance, leave requests, reports, and more.
          </Typography>
        </Paper>

        {/* Cards */}
        <Grid container spacing={3}>
          {features.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                elevation={4}
                sx={{
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 6,
                  },
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.96)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {item.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.desc}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={() => navigate(item.route)}
                    sx={{ mt: 2 }}
                  >
                    {item.title.toUpperCase()}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminPage;
