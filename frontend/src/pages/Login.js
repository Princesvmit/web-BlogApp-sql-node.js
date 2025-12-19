import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  Stack,
  Container,
  Divider
} from '@mui/material';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      
      // Use the callback to update user state in App.js
      if (res.data.user) {
        onLogin(res.data.user, res.data.token);
      }
      
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        sx={{ 
          p: 5, 
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }} 
        elevation={0}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom fontWeight={700} color="primary">
            🔐 Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        <Box component="form" onSubmit={submit}>
          <Stack spacing={3}>
            <TextField 
              label="Email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              fullWidth 
              variant="outlined"
              type="email"
              required
            />
            <TextField 
              label="Password" 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              fullWidth 
              variant="outlined"
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ py: 1.5, mt: 2 }}
            >
              Sign In
            </Button>
            
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Divider sx={{ my: 2 }}>or</Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: 'primary.main', 
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}