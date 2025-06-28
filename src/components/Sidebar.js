// 📁 Sidebar.js
import React, { useState, useEffect } from 'react';
import {
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
  Box,
  Badge,
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

const Sidebar = ({ collapsed, toggleSidebar, onLogout, navigate, user }) => {
  const [pendingLeaves, setPendingLeaves] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') {
      // ✅ Replace this with real API later
      const mockLeaveRequests = [
        { id: 1, status: 'Pending' },
        { id: 2, status: 'Approved' },
        { id: 3, status: 'Pending' },
      ];
      const pending = mockLeaveRequests.filter((l) => l.status === 'Pending').length;
      setPendingLeaves(pending);
    }
  }, [user]);

  const sidebarItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ...(user?.role === 'admin'
      ? [
          { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' },
          {
            text: 'Leave Management',
            icon: (
              <Badge badgeContent={pendingLeaves} color="error">
                <span role="img" aria-label="leave">📝</span>
              </Badge>
            ),
            path: '/admin/leave-management',
          },
        ]
      : []),
    { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
    { text: 'Attendance', icon: <AccessTimeIcon />, path: '/attendance' },
    { text: 'Leave Application', icon: <span>📝</span>, path: '/leave-application' },
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
          boxSizing: 'border-box',
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
          <Avatar src="https://i.postimg.cc/tCKkWL38/Company-Logo.jpg" sx={{ width: 50, height: 50, mb: 1 }} />
          {!collapsed && <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{user?.name || 'Welcome'}</Typography>}
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <List>
          {sidebarItems.map(item => (
            <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
              <ListItem
                button
                onClick={() => item.path === '/logout' ? onLogout() : navigate(item.path)}
                sx={{
                  px: collapsed ? 1 : 2,
                  '&:hover': { backgroundColor: '#132F4C' },
                }}
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

      {/* Footer Social Links */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, p: 2 }}>
        <Tooltip title="Instagram">
          <IconButton href="https://www.instagram.com/seekersautomation/" target="_blank" sx={{ color: '#fff' }}>
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" width={24} height={24} />
          </IconButton>
        </Tooltip>
<Tooltip title="Website">
  <IconButton href="https://seekersautomation.com/" target="_blank" sx={{ color: '#fff' }}>
   <img src="/Web.png" alt="Website" width={24} height={24} />
  </IconButton>
</Tooltip>
        <Tooltip title="LinkedIn">
          <IconButton href="https://www.linkedin.com/company/seekers-automation-pvt-ltd/" target="_blank" sx={{ color: '#fff' }}>
            <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn" width={24} height={24} />
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
