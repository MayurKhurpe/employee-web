// 📁 src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'api/axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Settings,
  AccountCircle,
  Dashboard as DashboardIcon,
  AccessTime as AccessTimeIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import LoginPage from './components/Login';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './components/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import HelpSupport from './pages/HelpSupport';
import SettingsPage from './pages/SettingsPage';
import AttendancePage from './pages/AttendancePage';
import NotificationSettings from './pages/NotificationSettingsPage';
import LinkedDevices from './pages/LinkedDevicesPage';
import MoreFunctionsPage from './pages/MoreFunctionsPage';
import MotivationCorner from './pages/MotivationCorner';
import FunZone from './pages/FunZone';
import EventCalendar from './pages/EventCalendar';
import DocumentCenter from './pages/DocumentCenter';
import WeatherReport from './pages/WeatherReport';
import MoodTracker from './pages/MoodTracker';
import TimerPage from './pages/TimerPage';
import CalculatorPage from './pages/CalculatorPage';
import Dashboard from './pages/Dashboard';
import LeaveApplicationPage from './pages/LeaveApplicationPage';
import AdminPage from './pages/AdminPage';
import Unauthorized from './pages/Unauthorized';

import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminBroadcastPage from './pages/admin/AdminBroadcastPage';
import AdminHolidaysPage from './pages/admin/AdminHolidaysPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminAttendancePage from './pages/admin/AdminAttendancePage';
import LeaveManagementPage from './pages/admin/LeaveManagementPage';

import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { EventProvider } from './context/EventContext';

import SendOTPPage from './pages/SendOTPPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import SetNewPasswordPage from './pages/SetNewPasswordPage';

function BackendChecker({ onReady }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const checkBackend = async () => {
    try {
      setLoading(true);
      setError(false);
      await axios.get('https://employee-backend-kifp.onrender.com/api/ping');
      setLoading(false);
      onReady();
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Connecting to backend...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="error">
          ⚠️ Backend server is starting up or unreachable.
        </Typography>
        <Button variant="contained" onClick={checkBackend} sx={{ mt: 2 }}>
          🔁 Retry
        </Button>
      </Box>
    );
  }

  return null;
}

function Sidebar({ collapsed, toggleSidebar, onLogout, navigate, user }) {
  const sidebarItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
    { text: 'Attendance', icon: <AccessTimeIcon />, path: '/attendance' },
    { text: 'Leave Application', icon: <span>📝</span>, path: '/leave-application' },
    ...(user?.role === 'admin'
      ? [
          { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' },
          { text: 'Leave Mgmt', icon: <span>✅</span>, path: '/admin/leave-management' },
        ]
      : []),
    { text: 'More Functions', icon: <span>✨</span>, path: '/more-functions' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Logout', icon: <Logout />, path: '/logout' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 60 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 60 : 240,
          backgroundColor: '#0B1D3A',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, justifyContent: collapsed ? 'center' : 'space-between' }}>
          <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <Avatar src={user?.profilePic || 'https://i.postimg.cc/tCKkWL38/Company-Logo.jpg'} sx={{ width: 50, height: 50, mb: 1 }} />
          {!collapsed && <Typography variant="subtitle2">{user?.name || 'Welcome'}</Typography>}
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <List>
          {sidebarItems.map(item => (
            <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
              <ListItem
                button
                onClick={() => item.path === '/logout' ? onLogout() : navigate(item.path)}
                sx={{ px: collapsed ? 1 : 2, '&:hover': { backgroundColor: '#132F4C' } }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: collapsed ? 'auto' : 2 }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

function Layout({ children, onLogout, user }) {
  const [collapsed, setCollapsed] = useState(localStorage.getItem('sidebar-collapsed') === 'true');
  const navigate = useNavigate();
  const toggleSidebar = () => {
    const newState = !collapsed;
    localStorage.setItem('sidebar-collapsed', newState);
    setCollapsed(newState);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} onLogout={onLogout} navigate={navigate} user={user} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
    </Box>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [backendReady, setBackendReady] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.get('/profile');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsLoggedIn(true);
    } catch (err) {
      console.error('❌ Failed to fetch user after login', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/profile')
        .then(res => {
          setUser(res.data);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(err => console.error('❌ Failed to fetch user profile', err));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        const parsed = JSON.parse(updatedUser);
        setUser((prev) => (JSON.stringify(prev) !== JSON.stringify(parsed) ? parsed : prev));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!backendReady) return <BackendChecker onReady={() => setBackendReady(true)} />;

  return (
    <EventProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/send-otp" element={<SendOTPPage />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/set-password" element={<SetNewPasswordPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* All protected routes below */}
            <Route path="/dashboard" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><ProfilePage updateUser={setUser} /></Layout></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><AttendancePage /></Layout></ProtectedRoute>} />
            <Route path="/leave-application" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><LeaveApplicationPage /></Layout></ProtectedRoute>} />
            <Route path="/more-functions" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><MoreFunctionsPage /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/timer" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><TimerPage /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/calculator" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><CalculatorPage /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/motivation" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><MotivationCorner /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/fun" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><FunZone /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/calendar" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><EventCalendar /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/documents" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><DocumentCenter /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/weather" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><WeatherReport /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/mood" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><MoodTracker /></Layout></ProtectedRoute>} />
            <Route path="/more-functions/breathing" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><div>🧘‍♀️ Breathing Exercise</div></Layout></ProtectedRoute>} />
            <Route path="/more-functions/notepad" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><div>📝 Mini Notepad</div></Layout></ProtectedRoute>} />
            <Route path="/more-functions/music" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><div>🎵 Lo-Fi Music</div></Layout></ProtectedRoute>} />
            <Route path="/more-functions/textcase" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><div>🔤 Text Case Converter</div></Layout></ProtectedRoute>} />
            <Route path="/more-functions/compass" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><div>🧭 Digital Compass</div></Layout></ProtectedRoute>} />
            <Route path="/more-functions/typing-test" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><div>⌨️ Typing Speed Test</div></Layout></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><ChangePasswordPage /></Layout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><SettingsPage /></Layout></ProtectedRoute>} />
            <Route path="/notification-settings" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><NotificationSettings /></Layout></ProtectedRoute>} />
            <Route path="/linked-devices" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><LinkedDevices /></Layout></ProtectedRoute>} />
            <Route path="/help-support" element={<ProtectedRoute><Layout onLogout={handleLogout} user={user}><HelpSupport /></Layout></ProtectedRoute>} />
            {/* Admin */}
            <Route path="/admin" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminPage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/users" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminUserManagementPage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/reports" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminReportsPage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminSettingsPage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/audit" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminAuditLogsPage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/broadcast" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminBroadcastPage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/holidays" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminHolidaysPage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/notifications" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminNotificationsPage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/attendance" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><AdminAttendancePage /></Layout></ProtectedAdminRoute>} />
            <Route path="/admin/leave-management" element={<ProtectedAdminRoute><Layout onLogout={handleLogout} user={user}><LeaveManagementPage /></Layout></ProtectedAdminRoute>} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </EventProvider>
  );
}
