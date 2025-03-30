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
      main: '#6C63FF', // Vibrant purple
      light: '#9D97FF',
      dark: '#4B44B3',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF6B6B', // Coral red
      light: '#FF9C9C',
      dark: '#C73E3E',
      contrastText: '#fff',
    },
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#4DABF5',
    },
    success: {
      main: '#66BB6A',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.07)',
    '0px 6px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 12px rgba(0, 0, 0, 0.09)',
    '0px 10px 14px rgba(0, 0, 0, 0.1)',
    '0px 12px 16px rgba(0, 0, 0, 0.11)',
    '0px 14px 18px rgba(0, 0, 0, 0.12)',
    '0px 16px 24px rgba(0, 0, 0, 0.13)',
    '0px 24px 32px rgba(0, 0, 0, 0.14)',
    '0px 32px 40px rgba(0, 0, 0, 0.15)',
    '0px 40px 48px rgba(0, 0, 0, 0.16)',
    '0px 48px 56px rgba(0, 0, 0, 0.17)',
    '0px 56px 64px rgba(0, 0, 0, 0.18)',
    '0px 64px 72px rgba(0, 0, 0, 0.19)',
    '0px 72px 80px rgba(0, 0, 0, 0.2)',
    '0px 80px 88px rgba(0, 0, 0, 0.21)',
    '0px 88px 96px rgba(0, 0, 0, 0.22)',
    '0px 96px 104px rgba(0, 0, 0, 0.23)',
    '0px 104px 112px rgba(0, 0, 0, 0.24)',
    '0px 112px 120px rgba(0, 0, 0, 0.25)',
    '0px 120px 128px rgba(0, 0, 0, 0.26)',
    '0px 128px 136px rgba(0, 0, 0, 0.27)',
    '0px 136px 144px rgba(0, 0, 0, 0.28)',
    '0px 144px 152px rgba(0, 0, 0, 0.29)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2D3748',
          color: '#FFFFFF',
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
