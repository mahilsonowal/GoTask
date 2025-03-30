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
  Grid,
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
    const board = boards.find(b => b.id === boardId);
    return board ? board.name : 'Unknown Board';
  };

  const getBoardColor = (boardId) => {
    const board = boards.find(b => b.id === boardId);
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
    return (subtasks.filter((st) => st.completed).length / subtasks.length) * 100;
  };

  const toggleComplete = (taskId) => {
    dispatch(toggleTaskComplete(taskId));
  };

  const getCompletedSubtasksCount = (subtasks) => {
    if (!subtasks?.length) return "0/0";
    return `${subtasks.filter(st => st.completed).length}/${subtasks.length}`;
  };

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          alignItems: 'center',
        }}
      >

        <Button
          variant="outlined"
          color="primary"
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ 
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(108, 99, 255, 0.04)',
            },
          }}
        >
          Filter
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: '16px',
            backgroundColor: 'background.paper',
          }}
        >
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
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
                >
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="progress">Progress</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid container xs={12} spacing={2} sx={{ mt: 1 }}>
              <Grid xs={12} sm={6}>
                <TextField
                  label="From Date"
                  type="date"
                  fullWidth
                  size="small"
                  value={filters.dateRange?.startDate || ''}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value ? parseISO(e.target.value) : null)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid xs={12} sm={6}>
                <TextField
                  label="To Date"
                  type="date"
                  fullWidth
                  size="small"
                  value={filters.dateRange?.endDate || ''}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value ? parseISO(e.target.value) : null)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              {(filters.dateRange?.startDate || filters.dateRange?.endDate) && (
                <Grid xs={12} sx={{ mt: 1 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => dispatch(updateFilters({ 
                      dateRange: { startDate: '', endDate: '' } 
                    }))}
                  >
                    Clear Date Filter
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {filteredTasks.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 6,
            textAlign: 'center',
          }}
        >
          <Box 
            sx={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              backgroundColor: 'rgba(108, 99, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No tasks found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try changing your filters or create a new task
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate('/task/new')}
          >
            Create New Task
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid key={task.id} xs={12} sm={6} lg={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 0,
                    width: '4px',
                    height: 'calc(100% - 32px)',
                    backgroundColor: task.completed ? theme.palette.success.main : getBoardColor(task.board),
                    borderTopRightRadius: '4px',
                    borderBottomRightRadius: '4px',
                  }}
                />
                <CardContent sx={{ pb: 2 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 1.5, 
                      pr: 1 
                    }}
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      icon={<UncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{ p: 0.5, mr: 1.5, mt: 0.5 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          lineHeight: 1.4,
                          mb: 0.5,
                          fontWeight: 600,
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? theme.palette.text.secondary : theme.palette.text.primary,
                        }}
                      >
                        {task.title}
                      </Typography>
                      
                      {task.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 2,
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit Task">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/task/edit/${task.id}`)}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Task">
                        <IconButton
                          size="small"
                          onClick={() => dispatch(deleteTask(task.id))}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      size="small"
                      icon={priorityIcons[task.priority]}
                      label={task.priority}
                      sx={{ 
                        borderRadius: '6px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    />
                    <Chip
                      size="small"
                      icon={<DashboardIcon fontSize="small" />}
                      label={getBoardName(task.board)}
                      sx={{ 
                        borderRadius: '6px',
                        backgroundColor: `${theme.palette[getBoardColor(task.board)].main}20`,
                        color: theme.palette[getBoardColor(task.board)].main,
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {task.dueDate && (
                        <Tooltip title="Due Date">
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <CalendarIcon
                              fontSize="small"
                              sx={{ 
                                mr: 0.5, 
                                color: new Date(task.dueDate) < new Date() && !task.completed
                                  ? theme.palette.error.main
                                  : theme.palette.text.secondary
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: new Date(task.dueDate) < new Date() && !task.completed
                                  ? theme.palette.error.main
                                  : theme.palette.text.secondary,
                                fontWeight: 500,
                              }}
                            >
                              {format(new Date(task.dueDate), 'MMM d')}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                    
                    {task.subtasks?.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 500, 
                              color: theme.palette.text.secondary
                            }}
                          >
                            {getCompletedSubtasksCount(task.subtasks)}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => toggleTaskExpansion(task.id)}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {expandedTasks.includes(task.id) ? (
                            <ExpandLessIcon fontSize="small" />
                          ) : (
                            <ExpandMoreIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  {task.subtasks?.length > 0 && (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(task.subtasks)}
                        sx={{ 
                          mt: 1.5, 
                          mb: 0.5, 
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: 'rgba(0,0,0,0.05)',
                        }}
                      />
                      
                      <Collapse in={expandedTasks.includes(task.id)}>
                        <List sx={{ mt: 1, py: 0 }}>
                          {task.subtasks.map((subtask, index) => (
                            <ListItem key={index} dense sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Checkbox
                                  edge="start"
                                  checked={subtask.completed}
                                  size="small"
                                  onChange={() => {
                                    const updatedSubtasks = [...task.subtasks];
                                    updatedSubtasks[index] = {
                                      ...subtask,
                                      completed: !subtask.completed,
                                    };
                                    dispatch(
                                      updateTask({
                                        ...task,
                                        subtasks: updatedSubtasks,
                                      })
                                    );
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={subtask.title}
                                primaryTypographyProps={{
                                  fontSize: '0.875rem',
                                  fontWeight: 400,
                                  textDecoration: subtask.completed ? 'line-through' : 'none',
                                  color: subtask.completed ? theme.palette.text.secondary : theme.palette.text.primary,
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default TaskList;