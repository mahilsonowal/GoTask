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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: 600,
              color: theme.palette.text.primary,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {menuItems.find(item => isActive(item.path))?.text || 'Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Search">
              <IconButton sx={{ mx: 1 }} onClick={handleSearchOpen}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton sx={{ mx: 1 }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Box 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                ml: 2, 
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/task/new')}
                sx={{
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 0.5 : 1,
                  borderRadius: '10px',
                  boxShadow: '0px 4px 10px rgba(108, 99, 255, 0.3)',
                  fontSize: isMobile ? '0.8rem' : 'inherit',
                }}
              >
                New Task
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Search Dialog */}
      <Dialog 
        open={searchOpen} 
        onClose={handleSearchClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: { 
            borderRadius: '12px',
            maxHeight: '80vh'
          }
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Search tasks..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '10px',
                  backgroundColor: theme.palette.background.default
                }
              }}
            />
            <IconButton onClick={handleSearchClose} sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {searchQuery && (
            <Box>
              {filteredTasks.length > 0 ? (
                <List>
                  {filteredTasks.map(task => (
                    <Paper 
                      key={task.id} 
                      elevation={1} 
                      sx={{ 
                        mb: 1, 
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <ListItemButton 
                        onClick={() => handleTaskClick(task.id)}
                        sx={{ 
                          p: 2,
                          borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                        }}
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Chip 
                                size="small" 
                                label={getBoardName(task.board)}
                                sx={{ mr: 1 }}
                              />
                              {task.completed && (
                                <Chip 
                                  size="small" 
                                  label="Completed"
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="body1" color="text.secondary">
                    No tasks found matching "{searchQuery}"
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
      
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