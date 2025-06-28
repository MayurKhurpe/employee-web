// 📁 src/pages/RegisterPage.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    department: "",
    address: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Very Weak";
    if (password.length < 8) return "Weak";
    if (!/\d/.test(password)) return "Medium";
    if (!/[A-Z]/.test(password)) return "Medium";
    if (!/[!@#$%^&*]/.test(password)) return "Strong";
    return "Very Strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: "", type: "success" });

    const {
      name,
      email,
      password,
      confirmPassword,
      mobile,
      department,
      address,
    } = formData;

    if (password !== confirmPassword) {
      return setSnackbar({
        open: true,
        type: "error",
        message: "❌ Passwords do not match.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setSnackbar({
        open: true,
        type: "error",
        message: "📧 Invalid email format.",
      });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return setSnackbar({
        open: true,
        type: "error",
        message: "📱 Invalid mobile number (10 digits)",
      });
    }

    try {
      await axios.post(
        `https://employee-backend-kifp.onrender.com/api/register-request`,
        {
          name,
          email,
          password,
          mobile,
          department,
          address,
        }
      );

      setSnackbar({
        open: true,
        type: "success",
        message: "🎉 Registration submitted! Awaiting admin approval.",
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        department: "",
        address: "",
      });

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        message:
          err?.response?.data?.error || "❌ Registration failed. Try again.",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url('https://i.postimg.cc/j2ZFXvhB/MES.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        px: 2,
      }}
    >
      {/* Blur Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={10} sx={{ p: 4, width: "100%", borderRadius: 4 }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            🚀 WELCOME TO FAMILY
            <br />
            REGISTER HERE
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mobile Number *"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Department *"
              name="department"
              value={formData.department}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password *"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            {formData.password && (
              <Typography
                variant="body2"
                sx={{
                  color:
                    passwordStrength === "Very Weak"
                      ? "red"
                      : passwordStrength === "Weak"
                      ? "orange"
                      : passwordStrength === "Medium"
                      ? "goldenrod"
                      : "green",
                  mt: 1,
                }}
              >
                Password Strength: {passwordStrength}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button fullWidth type="submit" variant="contained" sx={{ mt: 3 }}>
              REGISTER
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/login" underline="hover">
              Already registered? Go to Login
            </Link>
          </Typography>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
