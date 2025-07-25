// 📁 src/pages/SettingsPage.js
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
import LockResetIcon from "@mui/icons-material/LockReset";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import axios from 'api/axios';

// ✅ Settings list (Change Password removed)
const settingsOptions = [
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
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [profilePic, setProfilePic] = useState("");
  const [notifSettings, setNotifSettings] = useState({
    emailNotif: false,
    pushNotif: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/notification-settings");
        setNotifSettings({
          emailNotif: res.data.emailNotif || false,
          pushNotif: res.data.pushNotif || false,
        });
      } catch (err) {
        console.error("Failed to fetch notification settings", err);
      } finally {
        setLoading(false);
      }
    };

    const storedPic = localStorage.getItem("profilePic");
    setProfilePic(storedPic || "https://i.postimg.cc/gJBBYsML/Company-Logo.jpg");

    fetchSettings();
  }, []);

  const handleToggle = async (key) => {
    const newSettings = { ...notifSettings, [key]: !notifSettings[key] };
    setNotifSettings(newSettings);

    try {
      await axios.put("/notification-settings", newSettings);
      setSnackbar({ open: true, message: "✅ Notification setting updated" });
    } catch (err) {
      console.error("Failed to update setting", err);
      setSnackbar({ open: true, message: "❌ Update failed" });
    }
  };

  const handleOptionClick = (title, path) => {
    setSnackbar({ open: true, message: `Opening ${title}...` });
    setTimeout(() => navigate(path), 1000);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
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
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      />
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🔔 Notification Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Switch
                  checked={notifSettings.emailNotif}
                  onChange={() => handleToggle("emailNotif")}
                  color="primary"
                />
                <Typography display="inline">📧 Email Alerts</Typography>
              </Grid>
              <Grid item xs={12}>
                <Switch
                  checked={notifSettings.pushNotif}
                  onChange={() => handleToggle("pushNotif")}
                  color="primary"
                />
                <Typography display="inline">📲 Push Notifications</Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

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
                  primary={<Typography fontWeight={500}>{item.title}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

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
