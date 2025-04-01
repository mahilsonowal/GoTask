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
  Add as AddIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

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

  const getBoardColor = (boardId) => {
    const board = boards.find(b => b.id === boardId);
    return board ? board.color : 'primary';
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
    searchQuery && task && 
    (
      (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const handleTaskClick = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      navigate(`/board`, { 
        state: { 
          selectedTask: taskId,
          defaultBoard: task.board
        }
      });
    }
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
          position: 'relative',
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'white',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <span style={{ 
            color: theme.palette.primary.light,
            fontSize: '1.8rem',
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}>Go</span>
          <span style={{ 
            fontSize: '1.5rem',
            letterSpacing: '-0.01em'
          }}>Task</span>
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
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Avatar
            sx={{ 
              width: 45, 
              height: 45, 
              bgcolor: theme.palette.primary.main,
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
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
                ? 'rgba(37, 99, 235, 0.2)'
                : 'transparent',
              color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: isActive(item.path)
                  ? 'rgba(37, 99, 235, 0.3)'
                  : 'rgba(255, 255, 255, 0.05)',
                transform: 'translateX(4px)',
              },
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive(item.path)
                  ? theme.palette.primary.light
                  : 'rgba(255, 255, 255, 0.6)',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 400,
                letterSpacing: '0.01em',
              }}
            />
            {isActive(item.path) && (
              <Box
                sx={{
                  width: 4,
                  height: 35,
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: '4px',
                  transition: 'all 0.2s ease-in-out',
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
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: 'translateY(-1px)',
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
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, flexShrink: 0 }}>
              {menuItems.find(item => isActive(item.path))?.text || 'GoTask'}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flex: { xs: '1 1 100%', sm: '1 1 auto' }, 
              order: { xs: 3, sm: 2 },
              mt: { xs: 1, sm: 0 },
              mx: { xs: 0, md: 2 },
              maxWidth: { xs: '100%', sm: '320px', md: '400px' },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      sx={{ color: 'text.secondary' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }
                }
              }}
            />
            {searchQuery && filteredTasks.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: { xs: 0, md: 'auto' },
                  right: 0,
                  mt: 1,
                  width: { xs: 'calc(100% - 32px)', sm: 'auto', md: '400px' },
                  mx: { xs: 2, md: 0 },
                  maxHeight: '400px',
                  overflow: 'auto',
                  zIndex: 1300,
                  boxShadow: 3,
                  borderRadius: '8px',
                }}
              >
                <List>
                  {filteredTasks.map((task) => (
                    <ListItemButton
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      sx={{
                        borderRadius: '8px',
                        m: 0.5,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                            <Chip
                              label={getBoardName(task.board)}
                              size="small"
                              sx={{
                                backgroundColor: `${getBoardColor(task.board)}20`,
                                color: getBoardColor(task.board),
                                fontWeight: 500,
                                height: 20,
                                '& .MuiChip-label': { px: 1, py: 0 },
                              }}
                            />
                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{
                                backgroundColor: `${getPriorityColor(task.priority)}20`,
                                color: getPriorityColor(task.priority),
                                fontWeight: 500,
                                height: 20,
                                '& .MuiChip-label': { px: 1, py: 0 },
                              }}
                            />
                          </Box>
                        }
                        primaryTypographyProps={{
                          noWrap: true,
                          sx: { fontWeight: 500 }
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            order: { xs: 2, sm: 3 },
            flexShrink: 0 
          }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate('/task/new')}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                px: { sm: 1, md: 2 },
                py: 1,
                '& .MuiButton-startIcon': {
                  mr: { sm: 0.5, md: 1 }
                }
              }}
            >
              <Box sx={{ display: { sm: 'none', md: 'block' } }}>New Task</Box>
            </Button>
            <Tooltip title="New Task">
              <IconButton
                color="primary"
                onClick={() => navigate('/task/new')}
                sx={{ 
                  display: { xs: 'flex', sm: 'none' },
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                sx={{
                  color: 'text.secondary',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: '56px', sm: '64px' },
          backgroundColor: 'background.default',
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 