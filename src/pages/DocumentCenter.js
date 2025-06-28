import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

const DocumentCenter = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/documents`)
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch(() =>
        setSnackbar({ open: true, message: 'Failed to load documents.', severity: 'error' })
      );
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setDocuments((prev) => [data, ...prev]);
      setSnackbar({ open: true, message: `${data.name} uploaded.`, severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Upload failed.', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/api/documents/${id}`, { method: 'DELETE' });
    setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    setSnackbar({ open: true, message: 'Document deleted.', severity: 'info' });
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <PdfIcon color="error" />;
    if (type.includes('image')) return <ImageIcon color="primary" />;
    if (type.includes('word')) return <DescriptionIcon color="info" />;
    return <FileIcon />;
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url('https://i.postimg.cc/2y7sHQxP/MES.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          zIndex: 0,
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        py: 5,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 900,
          p: 4,
          borderRadius: 4,
          backdropFilter: 'blur(6px)',
          background: 'rgba(255,255,255,0.8)',
        }}
      >
        {/* ✅ Back to More Functions Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/more-functions')}
          sx={{
            mb: 2,
            textTransform: 'none',
            bgcolor: '#eeeeee',
            '&:hover': { bgcolor: '#e0e0e0' },
            fontWeight: 500,
          }}
        >
          Back to More Functions
        </Button>

        <Typography variant="h4" gutterBottom>
          📁 Document Center
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', my: 3 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ bgcolor: '#1976d2' }}
          >
            Upload Document
            <input type="file" hidden onChange={handleUpload} />
          </Button>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />,
            }}
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
        </Box>

        <List>
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <ListItem
                key={doc._id}
                secondaryAction={
                  <>
                    <Tooltip title="View">
                      <IconButton edge="end" onClick={() => window.open(`${API_BASE}/${doc.filePath}`, '_blank')}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `${API_BASE}/${doc.filePath}`;
                          link.download = doc.name;
                          link.click();
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton edge="end" onClick={() => handleDelete(doc._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              >
                <ListItemIcon>{getFileIcon(doc.type)}</ListItemIcon>
                <ListItemText
                  primary={doc.name}
                  secondary={`Size: ${doc.size} | Uploaded: ${new Date(
                    doc.uploadedAt
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              No documents found.
            </Typography>
          )}
        </List>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentCenter;
