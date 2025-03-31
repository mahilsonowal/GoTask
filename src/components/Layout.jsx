import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Tooltip,
  Badge,
  Button,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Paper,
  ListItemButton,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  FormatListBulleted as ListIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  FlagOutlined as FlagIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { tasks, boards } = useSelector(state => state.tasks);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { text: 'Tasks', icon: <ListIcon />, path: '/' },
    { text: 'Boards', icon: <DashboardIcon />, path: '/board' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getBoardName = (boardId) => {
    const board = boards.find(b => b.id === boardId);
    return board ? board.name : 'Unknown Board';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.primary.main;
    }
  };

  const filteredTasks = tasks.filter(task => 
    searchQuery && 
    (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleTaskClick = (taskId) => {
    navigate(`/task/edit/${taskId}`);
    handleSearchClose();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'white',
            letterSpacing: '0.5px',
          }}
        >
          <span style={{ color: theme.palette.primary.light }}>Go</span>Task
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Box sx={{ mt: 3, px: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            p: 2,
          }}
        >
          <Avatar
            sx={{ width: 45, height: 45, bgcolor: theme.palette.primary.main }}
          >
            M
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
              Mahil Sonowal
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Free Plan
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: '12px',
              backgroundColor: isActive(item.path)
                ? 'rgba(108, 99, 255, 0.2)'
                : 'transparent',
              color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: isActive(item.path)
                  ? 'rgba(108, 99, 255, 0.3)'
                  : 'rgba(255, 255, 255, 0.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive(item.path)
                  ? theme.palette.primary.light
                  : 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 400,
              }}
            />
            {isActive(item.path) && (
              <Box
                sx={{
                  width: 5,
                  height: 35,
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: '4px',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 3, mt: 'auto' }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 2,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {menuItems.find(item => isActive(item.path))?.text || 'GoTask'}
            </Typography>

            <Box sx={{ position: 'relative', flex: 1, maxWidth: { xs: '100%', sm: 400 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchOpen}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleSearchClose}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  },
                }}
              />
              
              {searchOpen && searchQuery && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    mt: 1,
                    maxHeight: 400,
                    overflow: 'auto',
                    zIndex: 1300,
                    boxShadow: 3,
                  }}
                >
                  <List>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <ListItemButton
                          key={task.id}
                          onClick={() => handleTaskClick(task.id)}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 0.5,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ flex: 1 }}>
                              {task.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={getBoardName(task.board)}
                              color={getSelectedBoardColor(task.board)}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              size="small"
                              label={task.priority}
                              color={getPriorityColor(task.priority)}
                            />
                            {task.dueDate && (
                              <Typography variant="caption" color="text.secondary">
                                Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                              </Typography>
                            )}
                          </Box>
                        </ListItemButton>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No tasks found" />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Profile">
              <IconButton color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                  M
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout; 