import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
  DialogContentText,
  DialogActions as MuiDialogActions,
  Paper,
  Avatar,
  CircularProgress,
  InputAdornment,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  ColorLens as ColorLensIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  FormatListBulleted as ListIcon,
  AddTask as AddTaskIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { addBoard, updateBoard, deleteBoard, deleteTask, toggleTaskComplete } from '../store/taskSlice';

const colorOptions = [
  { value: 'primary', label: 'Blue' },
  { value: 'secondary', label: 'Coral' },
  { value: 'error', label: 'Red' },
  { value: 'warning', label: 'Orange' },
  { value: 'info', label: 'Sky Blue' },
  { value: 'success', label: 'Green' },
];

function Board() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const boards = useSelector((state) => state.tasks.boards);
  const tasks = useSelector((state) => state.tasks.tasks);
  const [open, setOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: 'primary',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  const handleOpen = (board = null) => {
    if (board) {
      setEditingBoard(board);
      setFormData({
        name: board.name,
        color: board.color,
      });
    } else {
      setEditingBoard(null);
      setFormData({
        name: '',
        color: 'primary',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBoard(null);
    setFormData({
      name: '',
      color: 'primary',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Board name is required';
    }
    if (formData.name.trim().length > 20) {
      newErrors.name = 'Board name must be less than 20 characters';
    }
    if (!formData.color) {
      newErrors.color = 'Color is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editingBoard) {
        dispatch(updateBoard({
          ...editingBoard,
          ...formData,
        }));
        setSnackbar({
          open: true,
          message: 'Board updated successfully',
          severity: 'success'
        });
      } else {
        dispatch(addBoard({
          id: Date.now().toString(),
          ...formData,
        }));
        setSnackbar({
          open: true,
          message: 'Board added successfully',
          severity: 'success'
        });
      }
      handleClose();
    }
  };

  const handleDeleteClick = (board) => {
    if (board.name === 'Home') {
      setSnackbar({
        open: true,
        message: 'Cannot delete the Home board',
        severity: 'error'
      });
      return;
    }
    setBoardToDelete(board);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (boardToDelete) {
      dispatch(deleteBoard(boardToDelete.id));
      setSnackbar({
        open: true,
        message: 'Board deleted successfully',
        severity: 'success'
      });
      setDeleteDialogOpen(false);
      setBoardToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBoardToDelete(null);
  };

  const handleAddTaskClick = (event, board) => {
    setAnchorEl(event.currentTarget);
    setSelectedBoard(board);
  };

  const handleAddTaskClose = () => {
    setAnchorEl(null);
    setSelectedBoard(null);
  };

  const handleCreateTask = () => {
    if (selectedBoard) {
      navigate('/task/new', { 
        state: { 
          defaultBoard: selectedBoard.id,
          fromBoard: true 
        } 
      });
    }
    handleAddTaskClose();
  };

  const getTasksInBoard = (boardId) => {
    return tasks.filter(task => task.board === boardId);
  };

  const getTaskCount = (boardId) => {
    return tasks.filter(task => task.board === boardId).length;
  };

  const getCompletedTaskCount = (boardId) => {
    return tasks.filter(task => task.board === boardId && task.completed).length;
  };

  const getProgress = (boardId) => {
    const tasksInBoard = getTasksInBoard(boardId);
    if (tasksInBoard.length === 0) return 0;
    return Math.round((getCompletedTaskCount(boardId) / tasksInBoard.length) * 100);
  };

  const filteredBoards = boards.filter(board => 
    search === '' || board.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditTask = (taskId) => {
    navigate(`/task/edit/${taskId}`);
  };

  const handleDeleteTask = (taskId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
    }
  };

  const handleToggleTaskComplete = (taskId, event) => {
    event.stopPropagation();
    dispatch(toggleTaskComplete(taskId));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Boards
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search boards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 250 } }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              borderRadius: 2,
              boxShadow: '0px 4px 10px rgba(108, 99, 255, 0.3)',
            }}
          >
            New Board
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ flex: 1, overflow: 'auto' }}>
        {filteredBoards.map((board) => (
          <Grid item xs={12} sm={6} md={4} key={board.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                },
                transition: 'all 0.2s',
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: `${board.color}.main`,
                      }}
                    />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {board.name}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleAddTaskClick(e, board)}
                      sx={{ color: 'text.secondary', mr: 0.5 }}
                    >
                      <AddTaskIcon />
                    </IconButton>
                    {board.name !== 'Home' && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl(e.currentTarget);
                          setSelectedBoard(board);
                        }}
                        sx={{ color: 'text.secondary' }}
                      >
                        <MoreIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <List sx={{ p: 0 }}>
                    {getTasksInBoard(board.id).slice(0, 3).map((task) => (
                      <ListItem
                        key={task.id}
                        onClick={() => handleEditTask(task.id)}
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon
                            color={task.completed ? 'success' : 'disabled'}
                            onClick={(e) => handleToggleTaskComplete(task.id, e)}
                            sx={{ cursor: 'pointer' }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={task.title}
                          primaryTypographyProps={{
                            sx: {
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'text.secondary' : 'text.primary',
                            },
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteTask(task.id, e)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                    {getTasksInBoard(board.id).length > 3 && (
                      <ListItem>
                        <ListItemText
                          primary={`+${getTasksInBoard(board.id).length - 3} more tasks`}
                          primaryTypographyProps={{ color: 'text.secondary' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getCompletedTaskCount(board.id)}/{getTaskCount(board.id)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 6,
                      bgcolor: 'action.hover',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${getProgress(board.id)}%`,
                        height: '100%',
                        bgcolor: `${board.color}.main`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAddTaskClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <MenuItem onClick={handleCreateTask}>
          <ListItemIcon>
            <AddTaskIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add New Task</ListItemText>
        </MenuItem>
        {selectedBoard && selectedBoard.name !== 'Home' && (
          <>
            <Divider />
            <MenuItem onClick={() => {
              handleAddTaskClose();
              handleOpen(selectedBoard);
            }}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Board</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleAddTaskClose();
              handleDeleteClick(selectedBoard);
            }} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Board</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          {editingBoard ? 'Edit Board' : 'Create New Board'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                autoFocus
                required
                fullWidth
                label="Board Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                  },
                }}
              />
              
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1 }}>Board Color</FormLabel>
                <RadioGroup
                  row
                  name="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  sx={{ flexWrap: 'wrap', gap: 2 }}
                >
                  {colorOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={
                        <Radio
                          sx={{
                            '&.Mui-checked': {
                              color: theme.palette[option.value].main,
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: theme.palette[option.value].main,
                              mr: 0.5,
                            }}
                          />
                          {option.label}
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ 
                borderRadius: 2,
                px: 3,
                boxShadow: '0px 4px 10px rgba(108, 99, 255, 0.3)',
              }}
            >
              {editingBoard ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Delete Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this board? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: 2,
              px: 3,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Board; 