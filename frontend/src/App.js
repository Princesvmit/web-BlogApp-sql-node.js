import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewPost from './pages/NewPost';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Chip,
  Container
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[700],
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Create a unique storage key for each tab
const getTabStorageKey = (key) => {
  const tabId = sessionStorage.getItem('tabId') || Math.random().toString(36).substr(2, 9);
  sessionStorage.setItem('tabId', tabId);
  return `${tabId}_${key}`;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user state on component mount
  useEffect(() => {
    const initializeUser = () => {
      try {
        const userData = localStorage.getItem(getTabStorageKey('user'));
        const token = localStorage.getItem(getTabStorageKey('token'));
        
        if (userData && token) {
          setCurrentUser(JSON.parse(userData));
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        setCurrentUser(null);
      }
      setIsInitialized(true);
    };

    initializeUser();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key && (e.key.includes('user') || e.key.includes('token'))) {
        // Only respond to storage changes that don't belong to this tab
        if (!e.key.includes(getTabStorageKey('').replace('_', ''))) {
          initializeUser();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (userData, token) => {
    const userKey = getTabStorageKey('user');
    const tokenKey = getTabStorageKey('token');
    
    localStorage.setItem(userKey, JSON.stringify(userData));
    localStorage.setItem(tokenKey, token);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    const userKey = getTabStorageKey('user');
    const tokenKey = getTabStorageKey('token');
    
    localStorage.removeItem(userKey);
    localStorage.removeItem(tokenKey);
    setCurrentUser(null);
    navigate('/');
  };

  // Show loading until initialization is complete
  if (!isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <AppBar position="sticky" color="primary" elevation={2} sx={{ mb: 4 }}>
          <Toolbar>
            <Typography 
              variant="h5" 
              component={Link} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: 'inherit', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              📝 BlogSphere
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/new"
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                ✏️ New Post
              </Button>
              
              {currentUser ? (
                <>
                  <Chip
                    avatar={<Avatar sx={{ bgcolor: deepPurple[300] }}>
                      {currentUser.username?.charAt(0).toUpperCase()}
                    </Avatar>}
                    label={currentUser.username}
                    variant="outlined"
                    onClick={() => navigate(`/profile/${currentUser.username}`)}
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  />
                  <Button 
                    color="inherit" 
                    onClick={handleLogout}
                    sx={{ 
                      border: '1px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    sx={{ 
                      border: location.pathname === '/login' ? '1px solid white' : '1px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                    variant="contained"
                    sx={{ 
                      backgroundColor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'grey.100'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/new" element={<NewPost currentUser={currentUser} />} />
            <Route path="/posts/:id" element={<PostPage currentUser={currentUser} />} />
            <Route path="/profile/:username" element={<ProfilePage currentUser={currentUser} />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;