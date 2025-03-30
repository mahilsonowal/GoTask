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
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ 
            alignSelf: { xs: 'stretch', sm: 'flex-start' },
            height: { sm: '40px' }
          }}
        >
          Add Board
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search boards..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            maxWidth: '400px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            }
          }}
        />
      </Box>

      {filteredBoards.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'rgba(108, 99, 255, 0.1)',
                width: 80,
                height: 80,
              }}
            >
              <ListIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            </Avatar>
            <Typography variant="h6">No matching boards found</Typography>
            <Typography variant="body1" color="text.secondary">
              {search
                ? `No boards matching "${search}"`
                : "You haven't created any boards yet"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{ mt: 2 }}
            >
              Create Your First Board
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredBoards.map((board) => (
            <Grid key={board.id} xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 0, height: '100%' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 3, 
                    backgroundColor: `${theme.palette[board.color].main}08`,
                  }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette[board.color].main,
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <ColorLensIcon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {board.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getTaskCount(board.id)} tasks
                      </Typography>
                    </Box>
                    <Box>
                      <Tooltip title="Add Task">
                        <IconButton
                          onClick={(e) => handleAddTaskClick(e, board)}
                          sx={{ 
                            color: theme.palette[board.color].main,
                            backgroundColor: `${theme.palette[board.color].main}15`,
                            mr: 1,
                            '&:hover': {
                              backgroundColor: `${theme.palette[board.color].main}25`,
                            }
                          }}
                        >
                          <AddTaskIcon />
                        </IconButton>
                      </Tooltip>
                      <Box sx={{ display: 'inline-block' }}>
                        <Tooltip title="Board Options">
                          <IconButton
                            size="small" 
                            sx={{ 
                              color: 'text.secondary',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              }
                            }}
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedBoard(board);
                            }}
                          >
                            <MoreIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ position: 'relative', mr: 2 }}>
                        <CircularProgress
                          variant="determinate"
                          value={getProgress(board.id)}
                          size={50}
                          thickness={5}
                          sx={{
                            color: theme.palette[board.color].main,
                            opacity: 0.8,
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            component="div"
                            fontWeight={600}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            {getProgress(board.id)}%
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {getCompletedTaskCount(board.id)} / {getTaskCount(board.id)} tasks completed
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getTaskCount(board.id) === 0 
                            ? "Add a task to get started" 
                            : getProgress(board.id) === 100 
                              ? "All tasks completed!" 
                              : "Keep going!"}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {getTasksInBoard(board.id).length > 0 && (
                      <List sx={{ py: 0 }}>
                        {getTasksInBoard(board.id).slice(0, 3).map((task) => (
                          <ListItem 
                            key={task.id} 
                            disableGutters
                            sx={{ 
                              px: 0, 
                              py: 1,
                              borderLeft: task.completed ? `3px solid ${theme.palette.success.main}` : 'none',
                              pl: task.completed ? 1.5 : 0,
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              },
                              position: 'relative',
                              pr: 7, // Make room for the buttons
                            }}
                            onClick={() => handleEditTask(task.id)}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <IconButton 
                                size="small" 
                                edge="start"
                                onClick={(e) => handleToggleTaskComplete(task.id, e)}
                                sx={{ p: 0 }}
                              >
                                {task.completed ? (
                                  <CheckCircleIcon 
                                    fontSize="small"
                                    color="success"
                                  />
                                ) : (
                                  <CheckIcon 
                                    fontSize="small" 
                                    sx={{ color: 'transparent', border: '1px solid', borderColor: 'divider', borderRadius: '50%' }}
                                  />
                                )}
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText 
                              primary={task.title}
                              primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? theme.palette.text.secondary : theme.palette.text.primary,
                                noWrap: true,
                              }}
                            />
                            <ListItemSecondaryAction>
                              <Tooltip title="Edit Task">
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTask(task.id);
                                  }}
                                  sx={{ 
                                    fontSize: 'small',
                                    color: theme.palette.text.secondary,
                                    mr: 0.5,
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Task">
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={(e) => handleDeleteTask(task.id, e)}
                                  sx={{ 
                                    fontSize: 'small',
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                        
                        {getTasksInBoard(board.id).length > 3 && (
                          <Button
                            fullWidth
                            variant="text"
                            size="small"
                            onClick={() => navigate('/', { state: { board: board.id } })}
                            sx={{ 
                              mt: 1, 
                              textTransform: 'none',
                              color: theme.palette[board.color].main,
                              '&:hover': {
                                backgroundColor: `${theme.palette[board.color].main}10`,
                              }
                            }}
                          >
                            Show all {getTasksInBoard(board.id).length} tasks
                          </Button>
                        )}
                      </List>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAddTaskClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <MenuItem onClick={handleCreateTask} sx={{ py: 1.5 }}>
          <AddTaskIcon sx={{ mr: 1.5, fontSize: 20 }} /> New Task
        </MenuItem>
        {selectedBoard && selectedBoard.name !== 'Home' && (
          <>
            <Divider />
            <MenuItem onClick={() => {
              handleAddTaskClose();
              handleOpen(selectedBoard);
            }} sx={{ py: 1.5 }}>
              <EditIcon sx={{ mr: 1.5, fontSize: 20 }} /> Edit Board
            </MenuItem>
            <MenuItem onClick={() => {
              handleAddTaskClose();
              handleDeleteClick(selectedBoard);
            }} sx={{ color: theme.palette.error.main, py: 1.5 }}>
              <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} /> Delete Board
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
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            {editingBoard ? 'Edit Board' : 'New Board'}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pb: 1 }}>
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
                  }
                }}
              />
              
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1 }}>Board Color</FormLabel>
                <RadioGroup
                  row
                  name="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
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
                {errors.color && (
                  <Typography color="error" variant="caption">
                    {errors.color}
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              {editingBoard ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle id="delete-dialog-title">
          Delete Board
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this board? All tasks in this board will be moved to the Home board.
          </DialogContentText>
        </DialogContent>
        <MuiDialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDeleteCancel} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ borderRadius: 2 }}>
            Delete
          </Button>
        </MuiDialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Board; 