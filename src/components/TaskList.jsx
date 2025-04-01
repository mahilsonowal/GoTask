import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  LinearProgress,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  useTheme,
  useMediaQuery,
  Paper,
  Button,
  Divider,
  Avatar,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterAlt as FilterIcon,
  FlagOutlined as FlagIcon,
  CalendarMonth as CalendarIcon,
  More as MoreIcon,
  Dashboard as DashboardIcon,
  CheckCircleOutline as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  DateRange as DateRangeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { format, parseISO, isValid, isAfter, isBefore, isWithinInterval, endOfDay } from 'date-fns';
import {
  deleteTask,
  toggleTaskComplete,
  updateFilters,
  updateTask,
} from '../store/taskSlice';

const priorityIcons = {
  low: <FlagIcon color="success" />,
  medium: <FlagIcon color="warning" />,
  high: <FlagIcon color="error" />,
};

function TaskList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { tasks, filters, boards } = useSelector((state) => state.tasks);
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const getBoardName = (boardId) => {
    if (!boardId) return 'Unknown';
    const board = boards.find(b => b && b.id === boardId);
    return board ? board.name : 'Unknown Board';
  };

  const getBoardColor = (boardId) => {
    if (!boardId) return 'default';
    const board = boards.find(b => b && b.id === boardId);
    return board ? board.color : 'default';
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(updateFilters({ [filterType]: value }));
  };

  const handleDateRangeChange = (type, date) => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    dispatch(updateFilters({ 
      dateRange: { 
        ...(filters.dateRange || {}), 
        [type]: formattedDate 
      } 
    }));
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filters.status !== 'all' && task.completed !== (filters.status === 'completed')) {
        return false;
      }
      if (filters.board !== 'all' && task.board !== filters.board) {
        return false;
      }
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        try {
          if (task.dueDate) {
            const dueDate = parseISO(task.dueDate);
            const startDate = parseISO(filters.dateRange.startDate);
            const endDate = endOfDay(parseISO(filters.dateRange.endDate));
            
            if (isValid(dueDate) && isValid(startDate) && isValid(endDate)) {
              if (!isWithinInterval(dueDate, { start: startDate, end: endDate })) {
                return false;
              }
            }
          } else {
            return false;
          }
        } catch (error) {
          console.error("Date filtering error:", error);
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'dueDate':
          return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'progress':
          const aProgress = calculateProgress(a.subtasks);
          const bProgress = calculateProgress(b.subtasks);
          return bProgress - aProgress;
        default:
          return 0;
      }
    });

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const calculateProgress = (subtasks) => {
    if (!subtasks?.length) return 0;
    return (subtasks.filter((st) => st && st.completed).length / subtasks.length) * 100;
  };

  const toggleComplete = (taskId) => {
    dispatch(toggleTaskComplete(taskId));
  };

  const getCompletedSubtasksCount = (subtasks) => {
    if (!subtasks?.length) return "0/0";
    return `${subtasks.filter(st => st && st.completed).length}/${subtasks.length}`;
  };

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex',mt: 5 ,gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/task/new')}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              transition: 'all 0.2s ease-in-out',
              whiteSpace: 'nowrap',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            }}
          >
            New Task
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              transition: 'all 0.2s ease-in-out',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.04)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 4, 
            borderRadius: '16px',
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Board</InputLabel>
                <Select
                  value={filters.board}
                  label="Board"
                  onChange={(e) => handleFilterChange('board', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  <MenuItem value="all">All Boards</MenuItem>
                  {boards.map((board) => (
                    <MenuItem key={board.id} value={board.id}>
                      {board.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="progress">Progress</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      <Grid container spacing={{ xs: 2, sm: 2 }}>
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <Grid xs={12} key={task.id}>
            <Card
              sx={{
                borderRadius: '16px',
                transition: 'all 0.3s ease-in-out',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, sm: 2 } }}>
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    icon={<UncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-checked': {
                        color: 'success.main',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.04)',
                      },
                      p: { xs: '4px', sm: '8px' },
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      flexDirection: { xs: 'column', sm: 'row' },  
                      gap: { xs: 0.5, sm: 1 }, 
                      mb: 1,
                      flexWrap: 'wrap'
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary',
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                          lineHeight: 1.3,
                          mr: { xs: 0, sm: 1 },
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        label={getBoardName(task.board)}
                        size="small"
                        sx={{
                          backgroundColor: `${getBoardColor(task.board)}20`,
                          color: getBoardColor(task.board),
                          fontWeight: 500,
                          height: 24,
                          alignSelf: { xs: 'flex-start', sm: 'center' },
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {task.priority && priorityIcons[task.priority]}
                        <Typography variant="body2" color="text.secondary">
                          {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'None'}
                        </Typography>
                      </Box>
                      {task.dueDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                          </Typography>
                        </Box>
                      )}
                      {task.subtasks?.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DateRangeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {getCompletedSubtasksCount(task.subtasks)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    {task.subtasks?.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(task.subtasks)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 0.5, sm: 1 },
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/task/edit/${task.id}`)}
                      sx={{
                        color: 'text.secondary',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(deleteTask(task.id))}
                      sx={{
                        color: 'text.secondary',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: 'error.main',
                          backgroundColor: 'rgba(239, 68, 68, 0.04)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => toggleTaskExpansion(task.id)}
                      sx={{
                        color: 'text.secondary',
                        transition: 'all 0.2s ease-in-out',
                        transform: expandedTasks.includes(task.id) ? 'rotate(180deg)' : 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
              <Collapse in={expandedTasks.includes(task.id)}>
                <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description || 'No description provided'}
                  </Typography>
                  {task.subtasks?.length > 0 && (
                    <List dense>
                      {task.subtasks.map((subtask, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Checkbox
                              checked={subtask.completed}
                              onChange={() => {
                                const updatedSubtasks = [...task.subtasks];
                                updatedSubtasks[index] = {
                                  ...subtask,
                                  completed: !subtask.completed,
                                };
                                dispatch(updateTask({ id: task.id, subtasks: updatedSubtasks }));
                              }}
                              size="small"
                              sx={{
                                color: 'text.secondary',
                                '&.Mui-checked': {
                                  color: 'success.main',
                                },
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={subtask.title}
                            sx={{
                              textDecoration: subtask.completed ? 'line-through' : 'none',
                              color: subtask.completed ? 'text.secondary' : 'text.primary',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Collapse>
            </Card>
          </Grid>
        )) : (
          <Grid xs={12}>
            <Paper
              sx={{
                p: { xs: 3, sm: 5 },
                textAlign: 'center',
                borderRadius: '16px',
                backgroundColor: 'background.paper',
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                No tasks found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {filters.status !== 'all' || filters.board !== 'all' || filters.priority !== 'all' ? 
                  'Try changing your filter settings to see more tasks.' : 
                  'Start by creating your first task!'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/task/new')}
              >
                Create New Task
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default TaskList;