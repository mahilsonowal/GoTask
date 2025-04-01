import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Grid,
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
    return boardId ? tasks.filter(task => task && task.board === boardId) : [];
  };

  const getTaskCount = (boardId) => {
    return boardId ? tasks.filter(task => task && task.board === boardId).length : 0;
  };

  const getCompletedTaskCount = (boardId) => {
    return boardId ? tasks.filter(task => task && task.board === boardId && task.completed).length : 0;
  };

  const getProgress = (boardId) => {
    const tasksInBoard = getTasksInBoard(boardId);
    if (tasksInBoard.length === 0) return 0;
    return Math.round((getCompletedTaskCount(boardId) / tasksInBoard.length) * 100);
  };

  const filteredBoards = boards.filter(board => 
    !search || (board && board.name && board.name.toLowerCase().includes(search.toLowerCase()))
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
    if (taskId) {
      dispatch(toggleTaskComplete(taskId));
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        
        <Box sx={{ display: 'flex',mt: 5, gap: 2 }}>
          
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ 
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            New Board
          </Button>
        </Box>
      </Box>
    
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {boards.map((board) => (
          <Grid xs={12} sm={6} md={4} key={board.id}>
            <Card
              sx={{
                borderRadius: '16px',
                borderLeft: '4px solid',
                borderLeftColor: theme.palette[board.color].main,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardContent sx={{ 
                p: { xs: 2, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  mb: 2
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      color: theme.palette[board.color].dark,
                      mb: 0.5
                    }}>
                      {board.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getTaskCount(board.id)} tasks
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Tooltip title="Add task to this board">
                      <IconButton 
                        color="primary"
                        onClick={(e) => handleAddTaskClick(e, board)}
                        size="small"
                      >
                        <AddTaskIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit board">
                      <IconButton 
                        color="info"
                        onClick={() => handleOpen(board)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete board">
                      <span>
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteClick(board)}
                          size="small"
                          disabled={board.id === 'home'}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress
                    variant="determinate"
                    value={getProgress(board.id)}
                    size={36}
                    thickness={5}
                    sx={{ 
                      color: theme.palette[board.color].main,
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      },
                    }}
                  />
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {getCompletedTaskCount(board.id)}/{getTaskCount(board.id)}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ flex: 1 }}>
                  {getTasksInBoard(board.id).length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {getTasksInBoard(board.id)
                        .filter(task => !search || (task && task.title && task.title.toLowerCase().includes(search.toLowerCase())))
                        .slice(0, 4)
                        .map((task) => (
                          <ListItem
                            key={task.id}
                            sx={{
                              p: { xs: 2.5, sm: 2 },
                              borderRadius: '8px',
                              mb: 1,
                              backgroundColor: task.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 0, 0, 0.02)',
                              '&:hover': {
                                backgroundColor: task.completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: { xs: 36, sm: 44 } }}>
                              <IconButton
                                edge="start"
                                checked={task.completed}
                                onClick={(e) => handleToggleTaskComplete(task.id, e)}
                                size="small"
                                sx={{
                                  color: task.completed ? 'success.main' : 'action.disabled',
                                }}
                              >
                                {task.completed ? <CheckCircleIcon /> : <CheckIcon />}
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText
                              primary={task.title}
                              primaryTypographyProps={{
                                noWrap: true,
                                style: {
                                  textDecoration: task.completed ? 'line-through' : 'none',
                                  color: task.completed ? theme.palette.text.secondary : theme.palette.text.primary,
                                },
                              }}
                              sx={{ pr: 6 }}
                            />
                            <ListItemSecondaryAction sx={{ display: 'flex' }}>
                              <IconButton
                                edge="end"
                                onClick={() => handleEditTask(task.id)}
                                size="small"
                                sx={{ color: theme.palette.action.active }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                edge="end"
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                size="small"
                                sx={{ color: theme.palette.action.active }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      {getTasksInBoard(board.id).filter(task => !search || (task && task.title && task.title.toLowerCase().includes(search.toLowerCase()))).length > 4 && (
                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => navigate('/')}
                            sx={{ color: theme.palette[board.color].main }}
                          >
                            View all tasks
                          </Button>
                        </Box>
                      )}
                    </List>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        minHeight: 120,
                        p: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        No tasks in this board
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={(e) => handleAddTaskClick(e, board)}
                        sx={{ 
                          borderColor: theme.palette[board.color].main,
                          color: theme.palette[board.color].main,
                        }}
                      >
                        Add Task
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBoard ? 'Edit Board' : 'Create New Board'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Board Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 3 }}
          />
          
          <FormControl component="fieldset" error={!!errors.color}>
            <FormLabel component="legend">Board Color</FormLabel>
            <RadioGroup
              row
              name="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              sx={{ mt: 1 }}
            >
              {colorOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio 
                      sx={{ 
                        color: theme.palette[option.value].main,
                        '&.Mui-checked': {
                          color: theme.palette[option.value].main,
                        },
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {errors.color && (
              <Typography color="error" variant="caption">
                {errors.color}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingBoard ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the "{boardToDelete?.name}" board? This action cannot be undone, and all tasks in this board will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAddTaskClose}
      >
        <MenuItem onClick={handleCreateTask}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create New Task</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate('/')}>
          <ListItemIcon>
            <ListIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View All Tasks</ListItemText>
        </MenuItem>
      </Menu>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Board; 