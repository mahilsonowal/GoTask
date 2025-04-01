import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
  FormHelperText,
  Paper,
  Divider,
  Chip,
  Avatar,
  Tooltip,
  OutlinedInput,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  DialogContentText,
  Checkbox,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Flag as FlagIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  AddCircleOutline as AddCircleIcon,
} from '@mui/icons-material';
import { addTask, updateTask, addBoard } from '../store/taskSlice';
import { format, parseISO, isValid, isAfter, isBefore, addDays } from 'date-fns';

const initialTask = {
  id: '',
  title: '',
  description: '',
  board: 'home',
  priority: 'medium',
  startDate: '',
  dueDate: '',
  completed: false,
  subtasks: [],
  notifications: {
    startDate: false,
    dueDate: false,
  },
};

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

function TaskForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const tasks = useSelector((state) => state.tasks.tasks);
  const boards = useSelector((state) => state.tasks.boards);
  const [task, setTask] = useState({
    ...initialTask,
    board: location.state?.defaultBoard || 'home'
  });
  const [newSubtask, setNewSubtask] = useState('');
  const [errors, setErrors] = useState({});
  const [boardDialogOpen, setBoardDialogOpen] = useState(false);
  const [newBoardData, setNewBoardData] = useState({
    name: '',
    color: 'primary',
  });
  const [boardErrors, setBoardErrors] = useState({});

  // Format today's date as YYYY-MM-DD for date inputs
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  useEffect(() => {
    if (id) {
      const existingTask = tasks.find((t) => t.id === id);
      if (existingTask) {
        setTask(existingTask);
      }
    } else if (location.state?.defaultBoard) {
      setTask(prev => ({
        ...prev,
        board: location.state.defaultBoard
      }));
    }
  }, [id, tasks, location.state?.defaultBoard]);

  const validateForm = () => {
    const newErrors = {};
    if (!task.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!task.board) {
      newErrors.board = 'Board is required';
    }
    if (!task.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    // Date validations
    if (task.startDate && task.dueDate) {
      try {
        const start = parseISO(task.startDate);
        const due = parseISO(task.dueDate);
        
        if (isValid(start) && isValid(due) && isAfter(start, due)) {
          newErrors.startDate = 'Start date cannot be after due date';
        }
      } catch (error) {
        newErrors.dateError = 'Invalid date format';
      }
    }
    
    if (task.dueDate) {
      try {
        const due = parseISO(task.dueDate);
        const now = new Date();
        
        if (isValid(due) && isBefore(due, now) && !task.completed) {
          newErrors.dueDate = 'Due date is in the past';
        }
      } catch (error) {
        newErrors.dateError = 'Invalid date format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setTask((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked,
        },
      }));
    } else {
      setTask((prev) => ({
        ...prev,
        [name]: name === 'completed' ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (!id) {
        dispatch(addTask({ ...task, id: Date.now().toString() }));
      } else {
        dispatch(updateTask(task));
      }
      navigate('/');
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setTask((prev) => ({
        ...prev,
        subtasks: [
          ...prev.subtasks,
          { id: Date.now().toString(), title: newSubtask.trim(), completed: false },
        ],
      }));
      setNewSubtask('');
    }
  };

  const handleDeleteSubtask = (subtaskId) => {
    setTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((st) => st.id !== subtaskId),
    }));
  };

  const getSelectedBoardColor = () => {
    const selectedBoard = boards.find(b => b && b.id === task.board);
    return selectedBoard ? selectedBoard.color : 'primary';
  };

  const getSelectedBoardName = () => {
    const selectedBoard = boards.find(b => b && b.id === task.board);
    return selectedBoard ? selectedBoard.name : 'Unknown Board';
  };

  const handleBoardDialogOpen = () => {
    setBoardDialogOpen(true);
  };

  const handleBoardDialogClose = () => {
    setBoardDialogOpen(false);
    setNewBoardData({
      name: '',
      color: 'primary',
    });
    setBoardErrors({});
  };

  const validateBoardForm = () => {
    const errors = {};
    if (!newBoardData.name.trim()) {
      errors.name = 'Board name is required';
    }
    if (newBoardData.name.trim().length > 20) {
      errors.name = 'Board name must be less than 20 characters';
    }
    setBoardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitNewBoard = () => {
    if (validateBoardForm()) {
      const newBoard = {
        id: newBoardData.name.toLowerCase().replace(/\s+/g, '-'),
        name: newBoardData.name,
        color: newBoardData.color,
      };
      dispatch(addBoard(newBoard));
      handleBoardDialogClose();
      setTask((prev) => ({
        ...prev,
        board: newBoard.id,
      }));
    }
  };

  // Date presets for quick date selection
  const datePresets = {
    startDate: [
      { label: 'Today', value: format(new Date(), 'yyyy-MM-dd') },
      { label: 'Tomorrow', value: format(addDays(new Date(), 1), 'yyyy-MM-dd') },
      { label: 'Next Week', value: format(addDays(new Date(), 7), 'yyyy-MM-dd') },
    ],
    dueDate: [
      { label: 'Today', value: format(new Date(), 'yyyy-MM-dd') },
      { label: 'Tomorrow', value: format(addDays(new Date(), 1), 'yyyy-MM-dd') },
      { label: 'Next Week', value: format(addDays(new Date(), 7), 'yyyy-MM-dd') },
      { label: 'Two Weeks', value: format(addDays(new Date(), 14), 'yyyy-MM-dd') },
    ],
  };

  const handleDatePresetSelect = (dateType, value) => {
    setTask((prev) => ({
      ...prev,
      [dateType]: value,
    }));
  };

  const renderDateField = (label, dateType, helperText) => (
    <FormControl fullWidth margin="dense" error={!!errors[dateType]}>
      <InputLabel shrink>{label}</InputLabel>
      <Box sx={{ mt: 2.5, position: 'relative' }}>
        <TextField
          type="date"
          value={task[dateType]}
          onChange={(e) => setTask(prev => ({ ...prev, [dateType]: e.target.value }))}
          fullWidth
          variant="outlined"
          error={!!errors[dateType]}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            mt: 1, 
            flexWrap: 'wrap', 
            gap: 0.5, 
            '& .MuiChip-root': { mb: 0.5 } 
          }}
        >
          {datePresets[dateType].map((preset) => (
            <Chip
              key={preset.label}
              label={preset.label}
              size="small"
              onClick={() => handleDatePresetSelect(dateType, preset.value)}
              variant={task[dateType] === preset.value ? "filled" : "outlined"}
              color={task[dateType] === preset.value ? "primary" : "default"}
              sx={{ 
                height: 24, 
                '& .MuiChip-label': { px: 1, py: 0.5 }
              }}
            />
          ))}
          {task[dateType] && (
            <Chip
              label="Clear"
              size="small"
              onClick={() => handleDatePresetSelect(dateType, '')}
              variant="outlined"
              color="default"
              sx={{ 
                height: 24, 
                '& .MuiChip-label': { px: 1, py: 0.5 }
              }}
            />
          )}
        </Stack>
      </Box>
      {errors[dateType] && (
        <FormHelperText error>{errors[dateType]}</FormHelperText>
      )}
      {helperText && !errors[dateType] && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', mb: 4, alignItems: 'center' }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mr: 2, bgcolor: 'background.paper', boxShadow: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          {id ? 'Edit Task' : 'Create New Task'}
        </Typography>
      </Box>

      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ p: { xs: 2, sm: 3 }, pb: 0 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid xs={12}>
                <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
                  Title
                  {errors.title && (
                    <Typography component="span" color="error" sx={{ ml: 1, fontSize: '0.8rem' }}>
                      {errors.title}
                    </Typography>
                  )}
                </Typography>
                <TextField
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  placeholder="Task title"
                  fullWidth
                  variant="outlined"
                  error={!!errors.title}
                  sx={{ mb: 2, borderRadius: '12px' }}
                />
              </Grid>
              
              <Grid xs={12}>
                <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
                  Description
                </Typography>
                <TextField
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  placeholder="Task description"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2, borderRadius: '12px' }}
                />
              </Grid>
              
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
                  Board
                  {errors.board && (
                    <Typography component="span" color="error" sx={{ ml: 1, fontSize: '0.8rem' }}>
                      {errors.board}
                    </Typography>
                  )}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {boards.map((board) => (
                    <Chip
                      key={board.id}
                      avatar={
                        <Avatar sx={{ bgcolor: theme.palette[board.color].main + ' !important' }}>
                          <DashboardIcon fontSize="small" />
                        </Avatar>
                      }
                      label={board.name}
                      onClick={() => setTask(prev => ({ ...prev, board: board.id }))}
                      variant={task.board === board.id ? "filled" : "outlined"}
                      sx={{ 
                        borderColor: task.board === board.id ? theme.palette[board.color].main : 'divider',
                        bgcolor: task.board === board.id ? `${theme.palette[board.color].main}10` : 'transparent',
                        '&:hover': {
                          bgcolor: task.board === board.id ? `${theme.palette[board.color].main}20` : 'rgba(0, 0, 0, 0.04)',
                        },
                        mb: 0.5
                      }}
                    />
                  ))}
                  <Chip
                    icon={<AddCircleIcon />}
                    label="Create New Board"
                    onClick={handleBoardDialogOpen}
                    variant="outlined"
                    color="primary"
                    sx={{ 
                      borderStyle: 'dashed',
                      '&:hover': {
                        bgcolor: 'rgba(37, 99, 235, 0.08)',
                      },
                      mb: 0.5
                    }}
                  />
                </Box>
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  error={!!errors.priority} 
                  variant="outlined"
                >
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={task.priority}
                    label="Priority"
                    onChange={handleChange}
                    sx={{ borderRadius: '12px' }}
                    MenuProps={{
                      PaperProps: {
                        sx: { maxHeight: '300px' }
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <FlagIcon 
                          color={priorityColors[task.priority || 'medium']} 
                          sx={{ mr: 1 }}
                        />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
                    Start Date
                  </Typography>
                  <TextField
                    type="date"
                    name="startDate"
                    value={task.startDate || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ borderRadius: '12px' }}
                  />
                </FormControl>
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
                    Due Date
                  </Typography>
                  <TextField
                    type="date"
                    name="dueDate"
                    value={task.dueDate || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ borderRadius: '12px' }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Notifications & Status
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 2 }}>
              <Grid xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={task.notifications.startDate}
                      onChange={handleChange}
                      name="notifications.startDate"
                      color="primary"
                      disabled={!task.startDate}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography sx={{ mr: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Start date notification</Typography>
                      {!task.startDate && (
                        <Tooltip title="Set a start date first">
                          <span>ⓘ</span>
                        </Tooltip>
                      )}
                    </Box>
                  }
                />
              </Grid>
              
              <Grid xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={task.notifications.dueDate}
                      onChange={handleChange}
                      name="notifications.dueDate"
                      color="primary"
                      disabled={!task.dueDate}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography sx={{ mr: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Due date notification</Typography>
                      {!task.dueDate && (
                        <Tooltip title="Set a due date first">
                          <span>ⓘ</span>
                        </Tooltip>
                      )}
                    </Box>
                  }
                />
              </Grid>
              
              <Grid xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={task.completed}
                      onChange={handleChange}
                      name="completed"
                      color="success"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography sx={{ mr: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Mark as completed</Typography>
                      {task.completed && <CheckCircleIcon color="success" fontSize="small" />}
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Subtasks
            </Typography>
            
            <Grid container spacing={1}>
              <Grid xs={12}>
                {task.subtasks?.length > 0 ? (
                  task.subtasks.map((subtask, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1,
                        backgroundColor: 'background.paper', 
                        p: 1,
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Checkbox
                        checked={subtask.completed}
                        onChange={(e) => handleSubtaskChange(index, 'completed', e.target.checked)}
                        size="small"
                      />
                      <TextField
                        value={subtask.text}
                        onChange={(e) => handleSubtaskChange(index, 'text', e.target.value)}
                        variant="standard"
                        fullWidth
                        placeholder="Subtask description"
                        InputProps={{ 
                          disableUnderline: true, 
                          sx: { 
                            fontSize: '0.9rem',
                            textDecoration: subtask.completed ? 'line-through' : 'none',
                            color: subtask.completed ? 'text.secondary' : 'text.primary',
                          } 
                        }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveSubtask(index)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                    No subtasks added yet
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              backgroundColor: 'background.default',
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap: 1
            }}>
              <Chip
                avatar={
                  <Avatar 
                    sx={{ bgcolor: `${theme.palette[getSelectedBoardColor()].main} !important` }}
                  >
                    <DashboardIcon fontSize="small" />
                  </Avatar>
                }
                label={getSelectedBoardName()}
                sx={{ mb: 0.5 }}
              />
              <Chip
                avatar={
                  <Avatar sx={{ bgcolor: `${theme.palette[priorityColors[task.priority || 'medium']].main} !important` }}>
                    <FlagIcon fontSize="small" />
                  </Avatar>
                }
                label={`${task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'} Priority`}
                sx={{ mb: 0.5 }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }, 
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ 
                  borderRadius: '8px',
                  py: 1,
                  flexGrow: { xs: 1, sm: 0 },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ 
                  borderRadius: '8px',
                  py: 1,
                  flexGrow: { xs: 1, sm: 0 },
                }}
              >
                {id ? 'Update Task' : 'Create Task'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Dialog 
        open={boardDialogOpen} 
        onClose={handleBoardDialogClose}
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
            Create New Board
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmitNewBoard}>
          <DialogContent sx={{ pb: 1 }}>
            <Stack spacing={3}>
              <TextField
                autoFocus
                required
                fullWidth
                label="Board Name"
                value={newBoardData.name}
                onChange={(e) => setNewBoardData({ ...newBoardData, name: e.target.value })}
                error={!!boardErrors.name}
                helperText={boardErrors.name}
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
                  value={newBoardData.color}
                  onChange={(e) => setNewBoardData({ ...newBoardData, color: e.target.value })}
                >
                  {[
                    { value: 'primary', label: 'Blue' },
                    { value: 'secondary', label: 'Coral' },
                    { value: 'error', label: 'Red' },
                    { value: 'warning', label: 'Orange' },
                    { value: 'info', label: 'Sky Blue' },
                    { value: 'success', label: 'Green' },
                  ].map((option) => (
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
              onClick={handleBoardDialogClose}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                fontSize: isMobile ? '0.8rem' : 'inherit',
                py: isMobile ? 0.8 : 1,
                px: isMobile ? 1.5 : 2
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ 
                borderRadius: 2,
                fontSize: isMobile ? '0.8rem' : 'inherit',
                py: isMobile ? 0.8 : 1,
                px: isMobile ? 1.5 : 2
              }}
            >
              Create Board
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default TaskForm; 