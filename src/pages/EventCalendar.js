import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Snackbar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from '../api/axios';

const backgroundImage = 'https://i.postimg.cc/Yq51br7t/MES.jpg';

const categoryIcons = {
  Party: '🎉',
  Meeting: '🏢',
  Seminar: '🎓',
  Other: '📌',
};

export default function EventCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventData, setEventData] = useState({ title: '', category: 'Other' });
  const [currentId, setCurrentId] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const showToast = (msg, severity = 'success') => {
    setSnack({ open: true, msg, severity });
  };

  const loadEvents = () => {
    axios
      .get('/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('❌ Failed to load events:', err));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddOrEdit = async () => {
    const payload = {
      ...eventData,
      date: selectedDate.format('YYYY-MM-DD'),
    };

    try {
      if (editMode) {
        await axios.put(
          '/events',
          { ...payload, id: currentId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        showToast('Event updated');
      } else {
        await axios.post(
          '/events',
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        showToast('Event added');
      }
      loadEvents();
      setOpenDialog(false);
      setEditMode(false);
      setEventData({ title: '', category: 'Other' });
    } catch (err) {
      console.error('❌ Error saving event:', err);
      showToast('Error saving event', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      showToast('Event deleted');
      loadEvents();
    } catch (err) {
      console.error('❌ Error deleting event:', err);
      showToast('Error deleting event', 'error');
    }
  };

  const openEdit = (event) => {
    setEventData({ title: event.title, category: event.category });
    setCurrentId(event._id);
    setEditMode(true);
    setOpenDialog(true);
  };

  const filteredEvents = events.filter(
    (event) => dayjs(event.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  );

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 4,
          flexWrap: 'wrap',
          py: 6,
          px: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            minWidth: 320,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Tooltip title="Back">
              <IconButton onClick={() => navigate('/more-functions')}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" fontWeight="bold">
              📅 Event Calendar
            </Typography>
            <Tooltip title="Add Event">
              <IconButton onClick={() => setOpenDialog(true)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
          />
        </Paper>

        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            minWidth: 320,
            flexGrow: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            📌 Events on {selectedDate.format('DD MMM YYYY')}
          </Typography>
          {filteredEvents.length > 0 ? (
            <List>
              {filteredEvents.map((event, i) => (
                <ListItem
                  key={i}
                  secondaryAction={
                    <>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => openEdit(event)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(event._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                  sx={{ backgroundColor: '#f0f0f0', borderRadius: 2, mb: 1 }}
                >
                  <ListItemText
                    primary={`${categoryIcons[event.category] || '📌'} ${event.title}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No events for this date.</Typography>
          )}
        </Paper>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{editMode ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Event Title"
            margin="normal"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />
          <TextField
            select
            fullWidth
            label="Category"
            value={eventData.category}
            onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
          >
            {Object.keys(categoryIcons).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {categoryIcons[cat]} {cat}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddOrEdit} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
