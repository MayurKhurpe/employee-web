import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  useTheme,
  Slide,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { evaluate } from 'mathjs';

const CalculatorPage = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  const buttons = [
    ['C', '←', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handleClick = (value) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '←') {
      setInput((prev) => prev.slice(0, -1));
    } else if (value === '=') {
      try {
        const res = evaluate(input);
        setResult(res.toString());
        setHistory((prev) => [`${input} = ${res}`, ...prev.slice(0, 4)]);
      } catch {
        setResult('Error');
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      const validKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','%'];
      if (validKeys.includes(key)) {
        setInput((prev) => prev + key);
      } else if (key === 'Backspace') {
        setInput((prev) => prev.slice(0, -1));
      } else if (key === 'Enter') {
        try {
          const res = evaluate(input);
          setResult(res.toString());
          setHistory((prev) => [`${input} = ${res}`, ...prev.slice(0, 4)]);
        } catch {
          setResult('Error');
        }
      } else if (key === 'Escape') {
        setInput('');
        setResult('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://i.postimg.cc/Yq51br7t/MES.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      {/* Blur */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.4)',
          zIndex: 1,
        }}
      />
      {/* Calculator UI */}
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
        <Slide direction="up" in mountOnEnter unmountOnExit>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              width: '100%',
              maxWidth: 400,
              backdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              🧮 Calculator
            </Typography>

            <Box
              sx={{
                backgroundColor: '#f0f0f0',
                p: 2,
                mb: 2,
                borderRadius: 2,
                minHeight: 70,
                fontSize: '1.6rem',
                textAlign: 'right',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
              }}
            >
              {input || '0'}
              {result && (
                <Typography variant="subtitle2" sx={{ color: 'gray' }}>
                  = {result}
                </Typography>
              )}
            </Box>

            <Grid container spacing={1}>
              {buttons.map((row, rowIndex) => (
                <Grid container item spacing={1} key={rowIndex}>
                  {row.map((btn, index) => (
                    <Grid item xs={btn === '0' ? 6 : 3} key={index}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color={
                          btn === 'C'
                            ? 'error'
                            : btn === '='
                            ? 'success'
                            : ['+', '-', '*', '/'].includes(btn)
                            ? 'primary'
                            : 'inherit'
                        }
                        sx={{
                          fontSize: '1.2rem',
                          fontWeight: 500,
                          height: 50,
                          textTransform: 'none',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                        onClick={() => handleClick(btn)}
                      >
                        {btn}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>

            {history.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  🧾 History
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    maxHeight: 120,
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                  }}
                >
                  {history.map((item, index) => (
                    <Typography variant="body2" key={index}>
                      {item}
                    </Typography>
                  ))}
                </Paper>
              </Box>
            )}

            {/* Back Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate('/more-functions')}
            >
              ⬅ Back to More Functions
            </Button>
          </Paper>
        </Slide>
      </Box>
    </Box>
  );
};

export default CalculatorPage;
