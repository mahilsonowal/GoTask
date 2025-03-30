import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  VpnKey as VpnKeyIcon,
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  CloudUpload as CloudUploadIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function Settings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: 'Mahil Sonowal',
    email: 'mahil@example.com',
    avatar: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    dueDateAlerts: true,
    mentionNotifications: true,
    weeklyDigest: false,
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: 'primary',
    reducedMotion: false,
    compactMode: false,
    fontSize: 'medium',
  });
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };
  
  const handleAppearanceChange = (e) => {
    const { name, value, checked } = e.target;
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: e.target.type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSaveProfile = () => {
    // In a real application, this would update the profile in the backend
    setSnackbar({
      open: true,
      message: 'Profile saved successfully',
      severity: 'success',
    });
  };
  
  const handleSaveNotifications = () => {
    // In a real application, this would update notification settings in the backend
    setSnackbar({
      open: true,
      message: 'Notification settings updated',
      severity: 'success',
    });
  };
  
  const handleSaveAppearance = () => {
    // In a real application, this would update appearance settings in the backend
    setSnackbar({
      open: true,
      message: 'Appearance settings updated',
      severity: 'success',
    });
  };
  
  return (
    <Box>

      
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: '16px',
          overflow: 'hidden',
          mb: 4 
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            bgcolor: 'background.default',
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
            }
          }}
        >
          <Tab 
            icon={<PersonIcon />} 
            label="Profile" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<NotificationsIcon />} 
            label="Notifications" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<PaletteIcon />} 
            label="Appearance" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
        </Tabs>
        
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'center' : 'flex-start',
                  mb: 4,
                  gap: 3
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '2.5rem',
                    fontWeight: 500,
                  }}
                >
                  {profileData.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} mb={0.5}>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    {profileData.email}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mr: 2 }}
                  >
                    Upload Avatar
                    <input type="file" hidden />
                  </Button>
                  
                  <Chip 
                    label="Free Plan" 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                </Box>
              </Box>
              
              <Divider sx={{ mb: 4 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                    Change Password
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Current Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={profileData.password}
                    onChange={handleProfileChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={profileData.newPassword}
                    onChange={handleProfileChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Notification Preferences
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 3, borderRadius: '12px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Email Notifications
                      </Typography>
                      
                      <Stack spacing={2} mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.emailNotifications}
                              onChange={handleNotificationChange}
                              name="emailNotifications"
                              color="primary"
                            />
                          }
                          label="Receive email notifications"
                        />
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.weeklyDigest}
                              onChange={handleNotificationChange}
                              name="weeklyDigest"
                              color="primary"
                            />
                          }
                          label="Weekly task summary"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 3, borderRadius: '12px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Task Notifications
                      </Typography>
                      
                      <Stack spacing={2} mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.taskReminders}
                              onChange={handleNotificationChange}
                              name="taskReminders"
                              color="primary"
                            />
                          }
                          label="Task reminders"
                        />
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.dueDateAlerts}
                              onChange={handleNotificationChange}
                              name="dueDateAlerts"
                              color="primary"
                            />
                          }
                          label="Due date alerts"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 3, borderRadius: '12px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Other Notifications
                      </Typography>
                      
                      <Stack spacing={2} mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.pushNotifications}
                              onChange={handleNotificationChange}
                              name="pushNotifications"
                              color="primary"
                            />
                          }
                          label="Push notifications"
                        />
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.mentionNotifications}
                              onChange={handleNotificationChange}
                              name="mentionNotifications"
                              color="primary"
                            />
                          }
                          label="Mentions notifications"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveNotifications}
                >
                  Save Preferences
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Appearance Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Appearance Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 3, borderRadius: '12px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Theme
                      </Typography>
                      
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                          variant={appearanceSettings.theme === 'light' ? 'contained' : 'outlined'}
                          onClick={() => handleAppearanceChange({ target: { name: 'theme', value: 'light' } })}
                          startIcon={<LightModeIcon />}
                          sx={{ flex: 1 }}
                        >
                          Light
                        </Button>
                        
                        <Button
                          variant={appearanceSettings.theme === 'dark' ? 'contained' : 'outlined'}
                          onClick={() => handleAppearanceChange({ target: { name: 'theme', value: 'dark' } })}
                          startIcon={<DarkModeIcon />}
                          sx={{ flex: 1 }}
                        >
                          Dark
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 3, borderRadius: '12px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Primary Color
                      </Typography>
                      
                      <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Color</InputLabel>
                        <Select
                          name="primaryColor"
                          value={appearanceSettings.primaryColor}
                          onChange={handleAppearanceChange}
                          label="Color"
                        >
                          <MenuItem value="primary">Purple (Default)</MenuItem>
                          <MenuItem value="secondary">Coral</MenuItem>
                          <MenuItem value="info">Blue</MenuItem>
                          <MenuItem value="success">Green</MenuItem>
                          <MenuItem value="warning">Orange</MenuItem>
                          <MenuItem value="error">Red</MenuItem>
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 3, borderRadius: '12px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Accessibility
                      </Typography>
                      
                      <Stack spacing={2} mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={appearanceSettings.reducedMotion}
                              onChange={handleAppearanceChange}
                              name="reducedMotion"
                              color="primary"
                            />
                          }
                          label="Reduced motion"
                        />
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={appearanceSettings.compactMode}
                              onChange={handleAppearanceChange}
                              name="compactMode"
                              color="primary"
                            />
                          }
                          label="Compact mode"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 3, borderRadius: '12px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Text Size
                      </Typography>
                      
                      <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Font Size</InputLabel>
                        <Select
                          name="fontSize"
                          value={appearanceSettings.fontSize}
                          onChange={handleAppearanceChange}
                          label="Font Size"
                        >
                          <MenuItem value="small">Small</MenuItem>
                          <MenuItem value="medium">Medium (Default)</MenuItem>
                          <MenuItem value="large">Large</MenuItem>
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveAppearance}
                >
                  Save Settings
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${theme.palette.error.light}`,
          bgcolor: 'rgba(255, 82, 82, 0.04)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="error" sx={{ mb: 0.5 }}>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Permanently delete your account and all your data
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>
      
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

export default Settings; 