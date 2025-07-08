import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Fade,
  Snackbar,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';

const TextCaseConverter = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [snack, setSnack] = useState(false);

  const handleConvert = (type) => {
    switch (type) {
      case 'upper':
        setResult(text.toUpperCase());
        break;
      case 'lower':
        setResult(text.toLowerCase());
        break;
      case 'title':
        setResult(
          text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        );
        break;
      case 'clear':
        setText('');
        setResult('');
        break;
      default:
        break;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setSnack(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('https://i.postimg.cc/Yq51br7t/MES.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Blur Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.3)',
          zIndex: 0,
        }}
      />

      {/* Back Button */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/more-functions')}
          sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          Back to More Functions
        </Button>
      </Box>

      {/* Content */}
      <Fade in timeout={500}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 600,
            mx: 'auto',
            mt: 10,
            px: 2,
            textAlign: 'center',
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: 8,
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🔤 Text Case Converter
            </Typography>

            <TextField
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              label="Enter your text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 2 }}>
              <Button variant="contained" onClick={() => handleConvert('upper')}>UPPERCASE</Button>
              <Button variant="contained" onClick={() => handleConvert('lower')}>lowercase</Button>
              <Button variant="contained" onClick={() => handleConvert('title')}>Title Case</Button>
              <Button variant="outlined" onClick={() => handleConvert('clear')}>Clear</Button>
            </Box>

            {result && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  🎯 Converted Result
                </Typography>
                <Paper sx={{ p: 2, position: 'relative' }}>
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {result}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleCopy}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </>
            )}
          </Paper>
        </Box>
      </Fade>

      {/* Snackbar */}
      <Snackbar
        open={snack}
        autoHideDuration={2000}
        onClose={() => setSnack(false)}
        message="Copied to clipboard!"
      />
    </Box>
  );
};

export default TextCaseConverter;
