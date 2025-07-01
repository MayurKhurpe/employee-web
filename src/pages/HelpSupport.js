import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I change my password?',
    answer: 'Go to Settings → Change Password and follow the instructions.',
  },
  {
    question: 'What if I forgot my password?',
    answer: 'Click "Forgot Password" from the login screen to reset it.',
  },
  {
    question: 'How can I update my profile?',
    answer: 'Go to your Profile page and click "Save Changes" after editing.',
  },
];

export default function HelpSupport() {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 🔵 Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://i.postimg.cc/Yq51br7t/MES.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(15px)',
          zIndex: 0,
        }}
      />
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 2,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            width: '100%',
            maxWidth: 650,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            <SupportAgentIcon sx={{ mr: 1, color: 'primary.main' }} />
            Help & Support
          </Typography>

          {/* 📖 FAQ Section */}
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* 📞 Contact Info */}
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold">📞 Contact Us</Typography>
            <Typography>Email: hr@seekersautomation.com</Typography>
            <Typography>Support Hours: 9:30 AM - 6:30 PM (Mon-Sat)</Typography>
          </Box>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/settings')}
            fullWidth
            sx={{
              mt: 4,
              backgroundColor: '#555',
              color: '#fff',
              '&:hover': { backgroundColor: '#1976d2' },
            }}
          >
            Back to Settings
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
