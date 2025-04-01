import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Board from './components/Board';
import Settings from './components/Settings';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB', // Modern blue
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7C3AED', // Rich purple
      light: '#A78BFA',
      dark: '#5B21B6',
      contrastText: '#fff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    info: {
      main: '#3B82F6',
    },
    success: {
      main: '#10B981',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.05)',
    '0px 8px 12px rgba(0, 0, 0, 0.05)',
    '0px 12px 16px rgba(0, 0, 0, 0.05)',
    '0px 16px 24px rgba(0, 0, 0, 0.05)',
    '0px 24px 32px rgba(0, 0, 0, 0.05)',
    '0px 32px 40px rgba(0, 0, 0, 0.05)',
    '0px 40px 48px rgba(0, 0, 0, 0.05)',
    '0px 48px 56px rgba(0, 0, 0, 0.05)',
    '0px 56px 64px rgba(0, 0, 0, 0.05)',
    '0px 64px 72px rgba(0, 0, 0, 0.05)',
    '0px 72px 80px rgba(0, 0, 0, 0.05)',
    '0px 80px 88px rgba(0, 0, 0, 0.05)',
    '0px 88px 96px rgba(0, 0, 0, 0.05)',
    '0px 96px 104px rgba(0, 0, 0, 0.05)',
    '0px 104px 112px rgba(0, 0, 0, 0.05)',
    '0px 112px 120px rgba(0, 0, 0, 0.05)',
    '0px 120px 128px rgba(0, 0, 0, 0.05)',
    '0px 128px 136px rgba(0, 0, 0, 0.05)',
    '0px 136px 144px rgba(0, 0, 0, 0.05)',
    '0px 144px 152px rgba(0, 0, 0, 0.05)',
    '0px 152px 160px rgba(0, 0, 0, 0.05)',
    '0px 160px 168px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          height: 28,
          '& .MuiChip-label': {
            px: 1.5,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E293B',
          color: '#FFFFFF',
          borderRight: 'none',
          boxShadow: '4px 0 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<TaskList />} />
                <Route path="/task/new" element={<TaskForm />} />
                <Route path="/task/edit/:id" element={<TaskForm />} />
                <Route path="/board" element={<Board />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </Provider>
    </div>
  );
}

export default App
