import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Snackbar,
  Alert,
  Switch,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockResetIcon from "@mui/icons-material/LockReset";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DevicesIcon from "@mui/icons-material/Devices";

const settingsOptions = [
  {
    title: "🔐 Change Password",
    icon: <VpnKeyIcon color="primary" />,
    path: "/change-password",
  },
  {
    title: "🔁 Forgot Password",
    icon: <LockResetIcon color="error" />,
    path: "/forgot-password",
  },
  {
    title: "🆘 Help & Support",
    icon: <HelpOutlineIcon color="secondary" />,
    path: "/help-support",
  },
  {
    title: "🔔 Notification Preferences",
    icon: <NotificationsActiveIcon color="info" />,
    path: "/notification-settings",
  },
  {
    title: "💻 Linked Devices",
    icon: <DevicesIcon color="success" />,
    path: "/linked-devices",
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [profilePic, setProfilePic] = useState("");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    setProfilePic(
      storedPic || "https://i.postimg.cc/xTsQJtKN/default-profile.jpg"
    );
  }, []);

  const handleOptionClick = (title, path) => {
    setSnackbar({ open: true, message: `Opening ${title}...` });
    setTimeout(() => navigate(path), 1000);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* 🌄 Blurred Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: 'url("https://i.postimg.cc/Yq51br7t/MES.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(35px)",
          zIndex: 0,
        }}
      />
      {/* 🌑 Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      />
      {/* 🌟 Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width: "100%",
            maxWidth: 800,
            borderRadius: 4,
            p: 4,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          {/* 👤 Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              src={profilePic}
              sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
            />
            <Typography variant="h5" fontWeight="bold">
              ⚙️ Settings
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Manage your preferences and account
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 🔔 Notification Toggles */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🔔 Notification Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Switch
                  checked={notifEmail}
                  onChange={() => setNotifEmail(!notifEmail)}
                />
                <Typography display="inline">📧 Email Alerts</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Switch
                  checked={notifSMS}
                  onChange={() => setNotifSMS(!notifSMS)}
                />
                <Typography display="inline">📱 SMS Notifications</Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* ⚙️ Settings List */}
          <List>
            {settingsOptions.map((item, index) => (
              <ListItem
                key={index}
                onClick={() => handleOptionClick(item.title, item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 3,
                  backgroundColor: "#f9f9f9",
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                    transform: "scale(1.02)",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight={500}>{item.title}</Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          sx={{ width: "100%" }}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
